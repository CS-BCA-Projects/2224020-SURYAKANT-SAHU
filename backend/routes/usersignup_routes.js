import express from 'express'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import Donor from '../models/user_signup.js'

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use 587 instead of 465
  secure: false, // false for STARTTLS (recommended)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// Function to send a welcome email
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


//  Register a New User
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await Donor.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username already exists please enter other username" });
    }

    let donor = await Donor.findOne({ email });
    if (donor) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    donor = new Donor({ username, email, password: hashedPassword });

    await donor.save();

    sendWelcomeEmail(email);

    res.status(201).json({ msg: "User signup successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
