import express from "express";

const router = express.Router();

router.post("/callback", (req, res) => {
    const result = req.body;
    console.log(result);
    res.status(200).json({
        message: "Callback received",
        success: true,
    })
});

export default router;