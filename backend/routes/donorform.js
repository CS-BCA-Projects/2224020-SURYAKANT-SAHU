import express from "express";
import Donorregister from "../models/donorregisterform.js";
import nodemailer from "nodemailer";
import {authenticateUser} from "../middlewares/authMiddleware.js"; 

const router = express.Router(); // FIXED: use express.Router()

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT, // Use 587 instead of 465
  secure: false, // false for STARTTLS (recommended)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (userEmail) => {
  const mailOptions = {
    from: '"Blood Donation System" <suryakantsahu7879@gmail.com>',
    to: userEmail,
    subject: "Thank You for Registering as a Donor",
    text: "Thank you for registering as a donor. Your contribution can save lives!",
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/donorform", authenticateUser, async (req, res) => {
  try {
    const {
      First_Name,
      Last_Name,
      BloodGroup,
      State,
      District,
      Block,
      ContactNo,
      Email,
      Weight,
      DOB,
      Age,
      Gender,
      Profession,
      Pincode,
    } = req.body;
    console.log(req.user);
    const userId = req.user.userId;
    // Check if donor already exists
    const existingDonor = await Donorregister.findById({ userId });
    if (existingDonor) {
      return res.status(400).json({ msg: "You have already registered" });
    }

    // Create new donor document
    const newDonor = new Donorregister({
      userId: req.user.userId, // ✅ FIXED: Link donor to user
      First_Name,
      Last_Name,
      BloodGroup,
      State,
      District,
      Block,
      ContactNo,
      Email,
      Weight,
      DOB,
      Age,
      Gender,
      Profession,
      Pincode,
    });

    // Save to database
    await newDonor.save();

    // Send confirmation email
    await sendWelcomeEmail(Email);

    res.status(201).json({ msg: "Registration successful" });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;
