import express from "express";
import logger from '../util/logger.js';

const router = express.Router();

router.post("/callback", (req, res) => {
    const result = req.body;

    res.status(200).json({
        message: "Callback received",
        success: true,
    })
});

export default router;