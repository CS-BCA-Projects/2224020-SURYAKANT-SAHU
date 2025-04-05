import express from 'express';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/send_mail.js';
import Admin from '../models/admin_signup.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();


// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ 
  path: path.resolve(__dirname, '../../.env') 
});


// 🔹 Admin Forgot Password - Generate Reset Token
router.post("/forgot-password", async (req, res) => {
    try {
        const { email} = req.body;
        console.log(email)
        const admin = await Admin.findOne({ email });        
        if (!admin) {
            return res.status(400).json({ message: "❌ Email not found!" });
        }

        // Generate Reset Token (Expires in 15 minutes)
        const resetToken = jwt.sign({ id: admin._id}, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Save Reset Token & Expiry in DB
        admin.resetToken = resetToken;
        admin.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await admin.save();

        // Send Reset Email
        const resetLink = `${process.env.RESET_LINK}/reset-password/?token=${resetToken}&userType=admin`;

      const emailSent = await sendEmail (
       Email,
       "Reset Your Password",
       `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    );

        res.json({ message: "✅ Password reset link sent to your email!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

export default router;
