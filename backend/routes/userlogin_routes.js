import express from 'express';
import bcrypt from 'bcryptjs';
import Donor from '../models/user_signup.js';
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const donor = await Donor.findOne({ email });
        if (!donor) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, donor.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate Tokens
        const accessToken = generateAccessToken(donor);
        const refreshToken = generateRefreshToken(donor);
        
        donor.refreshToken = refreshToken;
        await donor.save();

        // Send tokens in HTTP-only cookies
       res.status(200)
       .cookie("refreshToken", refreshToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: "None" 
        }).cookie("accessToken", accessToken, { 
            httpOnly: true, 
            secure: true, 
            sameSite: "None" 
        }).json({ message: "Logged in successfully" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
