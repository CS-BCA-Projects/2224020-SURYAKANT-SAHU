import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Admin from '../models/admin_signup.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,, // Use 587 instead of 465
  secure: true, // false for STARTTLS (recommended)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 🔹 Admin Forgot Password - Generate Reset Token
router.post("/forgot-password", async (req, res) => {
    try {
        const { Email} = req.body;
        
        const admin = await Admin.findOne({ Email });        
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
        const resetLink = `/reset-password/?token=${resetToken}&userType=admin`;

        await transporter.sendMail({
            from: '"Blood Donation System" <suryakantsahu7879@gmail.com>',
            to: Email,
            subject: "Reset Your Password",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        });

        res.json({ message: "✅ Password reset link sent to your email!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

export default router;
