import sharp from 'sharp';
import { putObject } from './putObject.js';
import logger from './logger.js';

/**
 * Optimizes an image into WebP and AVIF formats, and uploads both to S3.
 * Returns the WebP URL as the primary URL, along with the base key.
 * 
 * @param {Buffer} buffer - The original image file buffer
 * @param {String} baseFileName - The base file name without extension (e.g. "features/1234")
 * @param {Number} width - The width to resize to
 * @param {Number} height - The height to resize to
 * @param {Object} options - Additional sharp resize options
 * @returns {Promise<{url: string, key: string}>} - The WebP url and key
 */
export const uploadOptimizedImages = async (buffer, baseFileName, width = 1200, height = null, options = { withoutEnlargement: true }) => {
    try {
        // Generate WebP
        const webpBuffer = await sharp(buffer)
            .resize(width, height, options)
            .webp({ quality: 80 })
            .toBuffer();

        // Generate AVIF
        const avifBuffer = await sharp(buffer)
            .resize(width, height, options)
            .avif({ quality: 70 }) // AVIF provides better compression, slightly lower quality value is fine
            .toBuffer();

        // Upload both to S3
        const webpUpload = await putObject(webpBuffer, `${baseFileName}.webp`, 'image/webp');
        if (!webpUpload || !webpUpload.url) {
            throw new Error("Failed to upload WebP image");
        }

        const avifUpload = await putObject(avifBuffer, `${baseFileName}.avif`, 'image/avif');
        if (!avifUpload || !avifUpload.url) {
            throw new Error("Failed to upload AVIF image");
        }

        return {
            urls: [webpUpload.url, avifUpload.url],
            keys: [webpUpload.key, avifUpload.key],
            url: webpUpload.url,
            key: webpUpload.key
        };
    } catch (error) {
        logger.error("Error in uploadOptimizedImages:", error);
        throw error;
    }
};
