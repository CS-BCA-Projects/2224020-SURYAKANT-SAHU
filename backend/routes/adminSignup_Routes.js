import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "../models/admin_signup.js";
import nodemailer from 'nodemailer'

dotenv.config();
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
const sendWelcomeEmail = (userEmail) => {
    const mailOptions = {
      from: '"Blood Donation System" <suryakantsahu7879@gmail.com>',
      to: userEmail,
      subject: "Welcome to Our Website!",
      text: "Thank you for signing up! We're excited to have you on board.",
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  };
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
        sendWelcomeEmail(Email);
        res.status(201).json({ msg: "Admin registered successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error!", error: error.message });
    }
});

export default router;
