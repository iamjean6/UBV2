import pool from '../pgdb/db.js';
import logger from '../util/logger.js';

export const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { items, total_amount, payment_method, shipping_details } = req.body;
        const userId = req.user?.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ status: 'error', message: 'No items in order' });
        }

        // 1. Create order
        const orderQuery = `
            INSERT INTO ecommerce.orders (user_id, total_amount, payment_method, shipping_address, city, phone_number, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            RETURNING id
        `;
        const orderValues = [
            userId || null,
            total_amount,
            payment_method,
            shipping_details.address,
            shipping_details.city,
            shipping_details.phone
        ];
        const orderResult = await client.query(orderQuery, orderValues);
        const orderId = orderResult.rows[0].id;

        for (const item of items) {
            const itemQuery = `
                INSERT INTO ecommerce.order_items (order_id, product_id, variant_id, quantity, price_at_purchase)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(itemQuery, [
                orderId,
                item.productId,
                item.variantId || null,
                item.quantity,
                item.price
            ]);
        }

        await client.query('COMMIT');
        res.status(201).json({ status: 'success', data: { orderId } });
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error('Error creating order:', err);
        res.status(500).json({ status: 'error', message: 'Failed to create order' });
    } finally {
        client.release();
    }
};

export const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body; // status: 'successful', 'failed', 'cancelled'
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Update order status
        const updateQuery = `
            UPDATE ecommerce.orders 
            SET status = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
            RETURNING *
        `;
        const result = await client.query(updateQuery, [status, orderId]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'error', message: 'Order not found' });
        }

        // 2. If status is 'successful', decrement stock
        if (status === 'successful') {
            const itemsQuery = `SELECT * FROM ecommerce.order_items WHERE order_id = $1`;
            const itemsResult = await client.query(itemsQuery, [orderId]);

            for (const item of itemsResult.rows) {
                if (item.variant_id) {
                    const stockQuery = `
                        UPDATE ecommerce.product_variants 
                        SET stock_quantity = GREATEST(0, stock_quantity - $1) 
                        WHERE id = $2
                    `;
                    await client.query(stockQuery, [item.quantity, item.variant_id]);
                }
            }
        }

        await client.query('COMMIT');
        res.status(200).json({ status: 'success', message: `Order ${orderId} updated to ${status}` });
    } catch (err) {
        await client.query('ROLLBACK');
        logger.error('Error updating order status:', err);
        res.status(500).json({ status: 'error', message: 'Failed to update order status' });
    } finally {
        client.release();
    }
};

export const getSuccessfulOrders = async (req, res) => {
    try {
        const queryText = `
            SELECT 
                o.user_id,
                c.name as username,
                o.id as order_id,
                p.name as product_name,
                oi.quantity,
                oi.price_at_purchase,
                o.created_at
            FROM ecommerce.orders o
            JOIN auth.customers c ON o.user_id = c.id
            JOIN ecommerce.order_items oi ON o.id = oi.order_id
            JOIN ecommerce.products p ON oi.product_id = p.id
            WHERE o.status = 'successful'
            ORDER BY o.created_at DESC
        `;
        const result = await pool.query(queryText);
        res.status(200).json({ status: 'success', data: result.rows });
    } catch (err) {
        logger.error('Error fetching successful orders:', err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch successful orders' });
    }
};
