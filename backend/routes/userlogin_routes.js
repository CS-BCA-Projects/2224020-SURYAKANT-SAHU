import express from "express";
import bcrypt from "bcryptjs";
import Donor from "../models/user_signup.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const router = express.Router();

// 🔹 User Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Donor.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "❌ User not found!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "❌ Invalid credentials!" });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // ✅ Save the new refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();  // Ensure it's saved before responding

        // ✅ Set Tokens in Cookies
        res.status(200)
            .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "None" })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "None" })
            .json({ success: true, redirectUrl: "/api/profile", message: "User logged in successfully" });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error!" });
    }
});


export default router;
