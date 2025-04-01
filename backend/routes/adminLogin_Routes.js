import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/admin_signup.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";


dotenv.config();
const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
    const { Email, Password } = req.body;

    
    try {
        // Check if admin exists
        const admin = await Admin.findOne({ Email, IsAdmin: true });
        
        if (!admin) {
            return res.status(401).json({ msg: "Invalid email or password!" });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(Password, admin.Password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password!" });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(admin);
        const refreshToken = generateRefreshToken(admin);
        
        admin.refreshToken = refreshToken;
        await admin.save();

        // Send tokens in HTTP-only cookies
        res.status(200)
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax"
            }).cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "Lax"
            }).json({ success: true, redirectUrl: "/api/adminprofile", message: "Admin logged in successfully " });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: error.message });
    }
});
export default router;
