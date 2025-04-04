import express from "express";
import sendEmail from '../utils/send_mail.js';

const router = express.Router(); // Fix: Use Router

// Request blood from a donor
router.post("/request_blood", async (req, res) => {
    const { donorEmail, name, contact , email} = req.body;
    console.log("Details are :", { donorEmail, name, contact , email} );
    
    if (!donorEmail || !name || !contact || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
          const emailSent = await sendEmail(
          donorEmail,
          "Blood Donation Request",
          `Dear Donor,\n\n${name} is requesting for a blood donation.\n\nContact: ${contact}\n\nEmail : ${email}`
          );
          if(!emailSent){
            return res.status(400).json("error in sendin mail");
          }
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email" });
    }
});

export default router;
