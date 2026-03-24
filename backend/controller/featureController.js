import FeatureStory from "../model/featureModel.js";
import { v4 } from "uuid";
import { putObject } from "../util/putObject.js";
import { getObject } from "../util/getObject.js";
import { deleteObject } from "../util/deleteObject.js";
import cache from "../cache/cache.js";
import mongoose from "mongoose";
import sharp from "sharp";

export const getFeatures = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const cachedFeatures = await cache.fetchFeatures(page, limit);
        if (cachedFeatures) {
            console.log("Features fetched from Cache");
            return res.status(200).json({ success: true, ...cachedFeatures });
        }
        
        const features = await FeatureStory.find().sort({ date: -1 }).skip(skip).limit(limit);
        const totalCount = await FeatureStory.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const cacheData = { data: features, currentPage: page, totalPages, totalCount };
        await cache.saveFeatures(page, limit, cacheData);
        
        console.log("Features fetched from db and cached");
        return res.status(200).json({ success: true, ...cacheData });
    } catch (err) {
        console.error("Error fetching features:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getOneStory = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedStory = await cache.fetchFeatureDetail(id);
        if (cachedStory) {
            console.log("Feature Story fetched from cache");
            return res.status(200).json({ success: true, data: cachedStory });
        }
        
        // Increment views
        const story = await FeatureStory.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        if (!story) {
            return res.status(404).json({ success: false, message: "Feature Story not found" });
        }
        
        try {
            if (story.key) await getObject(story.key);
        } catch (s3err) {
            console.warn("S3 getObject failed for key:", story.key, s3err.message);
        }
        
        await cache.saveFeatureDetail(id, story);
        console.log("Feature Story fetched from database and cached");
        return res.status(200).json({ success: true, data: story });
    } catch (err) {
        console.error("Error fetching story", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const createStory = async (req, res) => {
    try {
        const { title, excerpt, content, author, date, videoUrl } = req.body;
        const { file, videoFile } = req.files || {};

        const fileName = "features/" + v4();
        const videoFileName = videoFile ? "videos/" + v4() : null;

        const missing = [];
        if (!title) missing.push("title");
        if (!excerpt) missing.push("excerpt");
        if (!content) missing.push("content");
        if (!author) missing.push("author");

        if (missing.length > 0) {
            return res.status(400).json({
                status: "error",
                message: `Missing required fields: ${missing.join(", ")}`
            });
        }
        if (!file) {
            return res.status(400).json({
                status: "error",
                message: "Cover image is required"
            });
        }
        
        // Optimize cover image
        const optimizedBuffer = await sharp(file.data)
            .resize(1200, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        const uploadResult = await putObject(optimizedBuffer, fileName + ".webp", "image/webp");
        if (!uploadResult || !uploadResult.url) {
            throw new Error("Failed to upload cover image");
        }
        
        let finalVideoUrl = videoUrl || null;
        let finalVideoKey = null;
        if (videoFile) {
            const videoUpload = await putObject(videoFile.data, videoFileName, videoFile.mimetype);
            if (videoUpload && videoUpload.url) {
                finalVideoUrl = videoUpload.url;
                finalVideoKey = videoUpload.key;
            }
        }

        const story = await FeatureStory.create({
            title,
            excerpt,
            content,
            image: uploadResult.url,
            key: uploadResult.key,
            author,
            date: date || new Date(),
            video: finalVideoUrl,
            videoKey: finalVideoKey,
        });
        
        await cache.invalidateFeaturesCache();
        return res.status(201).json({
            status: "success",
            data: story,
        });
    } catch (err) {
        console.error('Error in creating a Feature Story', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const getLikes = async (req, res) => {
    try {
        const { id } = req.params;
        const cachedLikes = await cache.fetchFeatureLikes(id);
        if (cachedLikes) {
            console.log("Likes fetched from cache");
            return res.status(200).json({ success: true, data: cachedLikes });
        }
        const likes = await FeatureStory.findById(id).select("likes");
        await cache.saveFeatureLikes(id, likes);
        console.log("Likes fetched from database and cached");
        return res.status(200).json({ success: true, data: likes });
    } catch (err) {
        console.error("Error fetching likes:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, author, date, videoUrl } = req.body;
        const files = req.files || {};

        const story = await FeatureStory.findById(id);
        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }
        
        let updateData = {
            title,
            excerpt,
            content,
            author,
            date,
            video: videoUrl !== undefined ? videoUrl : story.video
        };
        
        if (files.file) {
            const fileName = "features/" + v4() + ".webp";
            const optimizedBuffer = await sharp(files.file.data)
                .resize(1200, null, { withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            const uploadedImage = await putObject(optimizedBuffer, fileName, "image/webp");
            if (uploadedImage && uploadedImage.url) {
                updateData.image = uploadedImage.url;
                updateData.key = uploadedImage.key;
            }
        }

        if (files.videoFile) {
            const videoFileName = story.videoKey || ("videos/" + v4());
            const uploadedVideo = await putObject(files.videoFile.data, videoFileName, files.videoFile.mimetype);
            if (uploadedVideo && uploadedVideo.url) {
                updateData.video = uploadedVideo.url;
                updateData.videoKey = uploadedVideo.key;
            }
        } 
        
        const updateStory = await FeatureStory.findByIdAndUpdate(id, updateData, { new: true });
        await cache.invalidateFeaturesCache(id);
        
        return res.status(200).json({ success: true, data: updateStory });
    } catch (err) {
        console.error("Error updating story:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await FeatureStory.findById(id);
        if (!story) {
            return res.status(404).json({ status: "error", message: "Feature Story not found" });
        }

        console.log(`Attempting deletion for Feature Story ID: ${id}`);

        if (story.key) {
            console.log(`S3 key found: ${story.key}. Attempting S3 deletion...`);
            const s3Response = await deleteObject(story.key);
            console.log("S3 Delete Result:", s3Response);

            if (s3Response && s3Response.status >= 400 && s3Response.status !== 404) {
                console.warn(`S3 image deletion failed for key ${story.key}: ${s3Response.message}`);
            }
        }
        
        if (story.videoKey) {
            console.log(`S3 video key found: ${story.videoKey}. Attempting S3 deletion...`);
            await deleteObject(story.videoKey);
        }

        await FeatureStory.findByIdAndDelete(id);
        await cache.invalidateFeaturesCache(id);

        return res.status(200).json({
            status: "success",
            message: "Article deleted successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "error", message: err.message });
    }
};