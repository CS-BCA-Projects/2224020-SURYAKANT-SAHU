import express from 'express'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import Donor from '../models/user_signup.js'

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

// 🔹 Forgot Password - Generate Reset Token
router.post("/forgot-password", async (req, res) => {
    try {
        const { email} = req.body;
        const donor = await Donor.findOne({ email });
  
        if (!donor) {
            return res.status(400).json({ message: "❌ Email not found!" });
        }
  
        // 🔸 Generate Reset Token (Expires in 15 minutes)
        const resetToken = jwt.sign({ id: donor._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        
        // 🔸 Save Reset Token & Expiry in DB
        donor.resetToken = resetToken;
        donor.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await donor.save();
  
        // 🔸 Send Reset Email
        const resetLink = `/reset-password/?token=${resetToken}&userType=users`;
        ;
        await transporter.sendMail({
            from: '"Blood Donation System" <suryakantsahu7879@gmail.com>',
            to: email,
            subject: "Reset Your Password",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        });
  
        res.json({ message: "✅ Password reset link sent to your email!" });
  
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
  });
  
  export default router;
