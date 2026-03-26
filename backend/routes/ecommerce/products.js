import express from 'express';
import pool from '../../pgdb/db.js';
import cache from '../../cache/cache.js';
import { v4 as uuidv4 } from 'uuid';
import { putObject } from '../../util/putObject.js';
import { deleteObject } from '../../util/deleteObject.js';
import { protectAdminRoute } from '../../middleware/authMiddleware.js';
import { logAdminActivity } from '../../middleware/adminActivityLogger.js';
import sharp from 'sharp';
import logger from '../../util/logger.js';

const router = express.Router();

// Helper to generate slug
const generateSlug = (name) => {
    return name.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// GET all categories
router.get('/categories', async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM ecommerce.categories ORDER BY name ASC');
        res.status(200).json({
            status: "success",
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
});

// GET all active products (Public)
router.get('/', async (req, res, next) => {
    try {
        const cachedProducts = await cache.fetchProducts();
        if (cachedProducts) {
            return res.status(200).json({
                status: "success",
                data: cachedProducts
            });
        }

        const queryText = `
            SELECT p.*, c.name as category_name,
            (
                SELECT json_agg(pi.*)
                FROM ecommerce.product_images pi
                WHERE pi.product_id = p.id
            ) as images,
            (
                SELECT json_agg(pv.*)
                FROM ecommerce.product_variants pv
                WHERE pv.product_id = p.id
            ) as variants
            FROM ecommerce.products p
            LEFT JOIN ecommerce.categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;
        const result = await pool.query(queryText);

        await cache.saveProducts(result.rows);

        res.status(200).json({
            status: "success",
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
});

// GET single product by slug (Public)
router.get('/:slug', async (req, res, next) => {
    try {
        const { slug } = req.params;

        const cachedProduct = await cache.fetchProductDetail(slug);
        if (cachedProduct) {
            return res.status(200).json({
                status: "success",
                data: cachedProduct
            });
        }

        const queryText = `
            SELECT p.*, c.name as category_name,
            (
                SELECT json_agg(pi.*)
                FROM ecommerce.product_images pi
                WHERE pi.product_id = p.id
            ) as images,
            (
                SELECT json_agg(pv.*)
                FROM ecommerce.product_variants pv
                WHERE pv.product_id = p.id
            ) as variants
            FROM ecommerce.products p
            LEFT JOIN ecommerce.categories c ON p.category_id = c.id
            WHERE p.slug = $1
        `;
        const result = await pool.query(queryText, [slug]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Product not found" });
        }

        await cache.saveProductDetail(slug, result.rows[0]);

        res.status(200).json({
            status: "success",
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// POST Create a new product (Admin)
router.post('/', protectAdminRoute, logAdminActivity('CREATE_PRODUCT', 'Ecommerce'), async (req, res, next) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { category_id, name, description, price, is_active, discount_percent } = req.body;

        let slug = req.body.slug;
        if (!slug && name) {
            slug = generateSlug(name) + '-' + uuidv4().split('-')[0]; // Ensure uniqueness
        }

        // 1. Insert Product
        const productQuery = `
            INSERT INTO ecommerce.products (category_id, name, slug, description, price, is_active, discount_percent)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const productValues = [
            category_id || null, name, slug, description, price,
            is_active !== undefined ? is_active : true,
            discount_percent || 0
        ];
        const productResult = await client.query(productQuery, productValues);
        const product = productResult.rows[0];

        // 2. Insert Variants
        let variants = [];
        if (req.body.variants) {
            try {
                // Parse variants since it might be stringified in multipart/form-data
                const parsedVariants = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants;

                for (let v of parsedVariants) {
                    const variantQuery = `
                        INSERT INTO ecommerce.product_variants (product_id, color, size, stock_quantity)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *
                    `;
                    const vRes = await client.query(variantQuery, [product.id, v.color, v.size, v.stock_quantity || 0]);
                    variants.push(vRes.rows[0]);
                }
            } catch (e) {
                logger.error("Failed to parse variants", e);
            }
        }

        // 3. Upload and Insert Images
        let uploadedImages = [];
        if (req.files && req.files.images) {
            // express-fileupload: if single file it's an object, if multiple it's an array
            let imagesToUpload = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            for (let i = 0; i < imagesToUpload.length; i++) {
                const file = imagesToUpload[i];
                const fileName = `products/images/${uuidv4()}_${file.name}`;
                const upload = await putObject(file.data, fileName, file.mimetype);

                if (upload) {
                    const is_primary = i === 0; // First image is primary by default
                    const imgQuery = `
                        INSERT INTO ecommerce.product_images (product_id, image_url, is_primary, alt_text)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *
                    `;
                    const imgRes = await client.query(imgQuery, [product.id, upload.url, is_primary, null]);
                    uploadedImages.push(imgRes.rows[0]);
                }
            }
        }

        await client.query('COMMIT');

        // Attach relations to response
        product.variants = variants;
        product.images = uploadedImages;

        await cache.invalidateProductsCache();

        res.status(201).json({
            status: 'success',
            data: product
        });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});
// PUT Update an existing product (Admin)
router.put('/:id', protectAdminRoute, logAdminActivity('UPDATE_PRODUCT', 'Ecommerce'), async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        await client.query('BEGIN');

        // Verify product exists
        const checkQuery = await client.query('SELECT slug FROM ecommerce.products WHERE id = $1', [id]);
        if (checkQuery.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        const oldSlug = checkQuery.rows[0].slug;

        const { category_id, name, description, price, is_active, discount_percent } = req.body;

        let slug = req.body.slug;
        if (!slug && name) {
            slug = generateSlug(name) + '-' + uuidv4().split('-')[0];
        }

        // 1. Update Product Core
        const productQuery = `
            UPDATE ecommerce.products 
            SET category_id = $1, name = $2, slug = $3, description = $4, price = $5, is_active = $6, discount_percent = $7
            WHERE id = $8
            RETURNING *
        `;
        const productValues = [
            category_id || null, name, slug || oldSlug, description, price,
            is_active !== undefined ? is_active : true,
            discount_percent || 0, id
        ];
        const productResult = await client.query(productQuery, productValues);
        const product = productResult.rows[0];

        // 2. Update Variants
        let updatedVariants = [];
        if (req.body.variants) {
            try {
                // Clear old variants first
                await client.query('DELETE FROM ecommerce.product_variants WHERE product_id = $1', [id]);

                const parsedVariants = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants;
                for (let v of parsedVariants) {
                    const variantQuery = `
                        INSERT INTO ecommerce.product_variants (product_id, color, size, stock_quantity)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *
                    `;
                    const vRes = await client.query(variantQuery, [id, v.color, v.size, v.stock_quantity || 0]);
                    updatedVariants.push(vRes.rows[0]);
                }
            } catch (e) {
                logger.error("Failed to parse/update variants", e);
            }
        }

        // 3. Upload new images (appends instead of replacing for simplicity right now)
        let uploadedImages = [];
        if (req.files && req.files.images) {
            let imagesToUpload = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

            for (let i = 0; i < imagesToUpload.length; i++) {
                const file = imagesToUpload[i];
                const fileName = `products/images/${uuidv4()}_${file.name}`;
                const upload = await putObject(file.data, fileName, file.mimetype);

                if (upload) {
                    const imgQuery = `
                        INSERT INTO ecommerce.product_images (product_id, image_url, is_primary, alt_text)
                        VALUES ($1, $2, false, null)
                        RETURNING *
                    `;
                    const imgRes = await client.query(imgQuery, [id, upload.url]);
                    uploadedImages.push(imgRes.rows[0]);
                }
            }
        }

        await client.query('COMMIT');

        // Invalidate old and new slug cache (if it changed)
        await cache.invalidateProductsCache(oldSlug);
        if (slug && slug !== oldSlug) {
            await cache.invalidateProductsCache(slug);
        }

        res.status(200).json({
            status: 'success',
            data: {
                ...product,
                variants: updatedVariants,
                new_images: uploadedImages
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
});

// DELETE a product (Admin)
router.delete('/:id', protectAdminRoute, logAdminActivity('DELETE_PRODUCT', 'Ecommerce'), async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch to clean up files from S3 before deleting from DB
        const productData = await pool.query('SELECT slug FROM ecommerce.products WHERE id = $1', [id]);
        if (productData.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }
        const productSlug = productData.rows[0].slug;

        const imagesResult = await pool.query('SELECT image_url FROM ecommerce.product_images WHERE product_id = $1', [id]);

        for (let row of imagesResult.rows) {
            if (row.image_url) {
                try {
                    const key = row.image_url.split('.com/')[1];
                    await deleteObject(key);
                } catch (e) {
                    logger.error("Failed to delete image from S3:", e);
                }
            }
        }

        const result = await pool.query('DELETE FROM ecommerce.products WHERE id = $1 RETURNING *', [id]);

        await cache.invalidateProductsCache(productSlug);

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    } catch (err) {
        next(err);
    }
});

export default router;