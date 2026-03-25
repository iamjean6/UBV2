import program from '../model/programModel.js';
import { v4 } from 'uuid';
import { putObject } from '../util/putObject.js';
import { getObject } from '../util/getObject.js';
import { deleteObject } from '../util/deleteObject.js';
import cache from '../cache/cache.js';
import sharp from 'sharp';
import logger from '../util/logger.js';

export const getPrograms = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const cachedPrograms = await cache.fetchPrograms(page, limit);
        if (cachedPrograms) {
            return res.status(200).json({
                "status": "success",
                ...cachedPrograms
            });
        }

        const events = await program.find().sort({ _id: -1 }).skip(skip).limit(limit);
        const totalCount = await program.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const cacheData = { data: events, currentPage: page, totalPages, totalCount };
        await cache.savePrograms(page, limit, cacheData);


        return res.status(200).json({
            "status": "success",
            ...cacheData
        })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ "status": "error", "message": err.message })
    }
}

export const getOneProgram = async (req, res) => {
    try {
        const { id } = req.params
        const cachedProgram = await cache.fetchProgramDetail(id);
        if (cachedProgram) {

            return res.status(200).json({
                "status": "success",
                "data": cachedProgram
            });
        }

        const event = await program.findById(id)

        if (!event) {
            return res.status(404).json({
                "status": "error",
                "message": "Program not found"
            })
        }
        await getObject(event.key);
        await cache.saveProgramDetail(id, event);


        return res.status(200).json({
            "status": "success",
            "data": event
        })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ "status": "error", "message": err.message })
    }
}

export const createProgram = async (req, res) => {
    try {
        const { title, synopsis } = req.body
        const { file } = req.files || {}
        const galleryFiles = req.files?.galleryFiles; // Can be single or array
        const fileName = "images/" + v4()

        if (!title || !synopsis || !file) {
            return res.status(400).json({
                "status": "error",
                "message": "Please enter all fields correctly"
            })
        }

        // Optimize main image
        const optimizedBuffer = await sharp(file.data)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const uploadResult = await putObject(optimizedBuffer, fileName + '.webp');
        if (!uploadResult || !uploadResult.url) {
            return res.status(500).json({
                "status": "error",
                "message": "Main image is not uploaded",
            });
        }

        let galleryUrls = [uploadResult.url];
        if (galleryFiles) {
            const filesToUpload = Array.isArray(galleryFiles) ? galleryFiles : [galleryFiles];
            for (const gFile of filesToUpload) {
                const gFileName = "gallery/" + v4();
                const gOptimized = await sharp(gFile.data)
                    .resize(1200, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();
                const gResult = await putObject(gOptimized, gFileName + '.webp');
                if (gResult?.url) galleryUrls.push(gResult.url);
            }
        }

        const event = await program.create({
            title,
            synopsis,
            image: uploadResult.url,
            images: galleryUrls,
            key: uploadResult.key
        });

        await cache.invalidateProgramsCache();

        return res.status(201).json({
            "status": "success",
            "data": event,
        })
    } catch (err) {
        logger.error('Error in createProgram:', err);
        return res.status(500).json({ "status": "error", "message": err.message })
    }
}

export const updateProgram = async (req, res) => {
    try {
        const { id } = req.params
        const { title, synopsis } = req.body
        const files = req.files || {}
        const galleryFiles = req.files?.galleryFiles;

        const event = await program.findById(id)
        if (!event) {
            return res.status(404).json({
                "status": "error",
                "message": "Program not found"
            })
        }

        let updateData = { title, synopsis };
        let currentImages = [...event.images];

        if (files.file) {
            const fileName = "images/" + v4() + ".webp";
            const optimizedBuffer = await sharp(files.file.data)
                .resize(1200, null, { withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            const uploadResult = await putObject(optimizedBuffer, fileName)
            if (uploadResult && uploadResult.url) {
                updateData.image = uploadResult.url;
                updateData.key = uploadResult.key;
                if (currentImages[0] === event.image) {
                    currentImages[0] = uploadResult.url;
                } else {
                    currentImages.unshift(uploadResult.url);
                }
            }
        }

        if (galleryFiles) {
            const filesToUpload = Array.isArray(galleryFiles) ? galleryFiles : [galleryFiles];
            for (const gFile of filesToUpload) {
                const gFileName = "gallery/" + v4() + ".webp";
                const gOptimized = await sharp(gFile.data)
                    .resize(1200, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toBuffer();
                const gResult = await putObject(gOptimized, gFileName);
                if (gResult?.url) currentImages.push(gResult.url);
            }
        }

        updateData.images = currentImages;

        const updatedEvent = await program.findByIdAndUpdate(id, updateData, { new: true })

        await cache.invalidateProgramsCache(id);

        return res.status(200).json({
            "status": "success",
            "data": updatedEvent
        })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ "status": "error", "message": err.message })
    }
}


export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params
        const event = await program.findById(id)
        if (!event) {
            return res.status(404).json({
                "status": "error",
                "message": "Program not found"
            })
        }
        const data = await deleteObject(event.key)
        if (data.status !== 204 && data.status !== 200) {
            return res.status(500).json({
                "status": "error",
                "message": "Image is not deleted from S3"
            })
        }
        await program.findByIdAndDelete(id)

        await cache.invalidateProgramsCache(id);

        return res.status(200).json({
            "status": "success",
            "message": "Program deleted successfully"
        })
    } catch (err) {
        logger.error(err)
        return res.status(500).json({ "status": "error", "message": err.message })
    }
}

