import express from "express";
import jwt from "jsonwebtoken";
import Donor from "../models/user_signup.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const router = express.Router();

// 🔹 Refresh Token Route
router.post("/refresh-token", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(403).json({ message: "❌ Refresh Token required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await Donor.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "❌ Invalid Refresh Token" });
        }

        // Generate a new Access Token & Refresh Token
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200)
            .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "None" })
            .cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "None" })
            .json({ accessToken: newAccessToken });

    } catch (error) {
        return res.status(403).json({ message: "❌ Token Expired or Invalid" });
    }
});

export default router;
