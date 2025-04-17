import express from 'express';
import Donor from '../models/user_signup.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ 
  path: path.resolve(__dirname, '../../.env') 
});

const router = express.Router();

router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(403).json({ error: "Refresh token required" });
        }

        // Remove refresh token from the database
        await Donor.findOneAndUpdate({ refreshToken }, { refreshToken: null });

        // Clear the cookie and send success response
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict",domain: "", path: "/" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict",domain: "", path: "/"  });
        return res.status(200).json({ success: true, msg: "Logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
