import express from "express";
import nodemailer from "nodemailer";

const router = express.Router(); // Fix: Use Router

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 25, // Use 587 instead of 465
    secure: false, // false for STARTTLS (recommended)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Request blood from a donor
router.post("/request_blood", async (req, res) => {
    const { donorEmail, name, contact , email} = req.body;
    console.log("Details are :", { donorEmail, name, contact , email} );
    
    if (!donorEmail || !name || !contact || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Define mailOptions inside the function
    const mailOptions = {
        from: '"Blood Donation System" <suryakantsahu7879@gmail.com>',
        to: donorEmail,
        subject: "Blood Donation Request",
        text: `Dear Donor,\n\n${name} is requesting for a blood donation.\n\nContact: ${contact}\n\nEmail : ${email}`
    };
    console.log("Using Email:", process.env.EMAIL_USER);
console.log("Using Password:", process.env.EMAIL_PASS ? "Present" : "Missing");

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Request sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

export default router;
