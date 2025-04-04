import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/admin_signup.js";
import sendEmail from '../utils/send_mail.js';

const router = express.Router();

// Handle admin signup
router.post("/signup", async (req, res) => {
    const { FullName, Email, Password, AdminKey } = req.body;

    try {
        // Validate Admin Key
        if (!AdminKey || AdminKey !== process.env.ADMIN_SECRET_KEY) {
            return res.status(403).json({ msg: "Invalid Admin Key!" });
        }

        // Check if Admin already exists
        const existingAdmin = await Admin.findOne({ Email, IsAdmin: true });
        if (existingAdmin) {
            return res.status(400).json({ msg: "Admin account already exists!" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Create new Admin
        const newAdmin = new Admin({
            FullName,
            Email,
            Password: hashedPassword,
            IsAdmin: true, // Mark as Admin
        });

        await newAdmin.save();
            // Send confirmation email
      const emailSent = await sendEmail (
      Email,
       "Welcome to Our Website!",
       "Thank you for signing up! We're excited to have you on board."
    );
        res.status(201).json({ msg: "Admin registered successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error!", error: error.message });
    }
});

export default router;
