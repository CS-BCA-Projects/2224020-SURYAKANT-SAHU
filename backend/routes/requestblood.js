import express from "express";
import sendEmail from '../utils/send_mail.js';
import Request from '../models/request.js'

const router = express.Router(); // Fix: Use Router

// Request blood from a donor
router.post("/request_blood", async (req, res) => {
    const { donorEmail, name, contact , email,donorId} = req.body;
    console.log("Details are :", { donorEmail, name, contact , email,donorId} );
    
    if (!donorEmail || !name || !contact || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const data= await Request.create({name , contact,email,requestedTo:donorId})
    if(!data){return response.status(400).json({message:"error in registring request"})}
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
