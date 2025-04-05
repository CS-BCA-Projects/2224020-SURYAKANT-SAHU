import express from 'express'
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/send_mail.js';
import Donor from '../models/user_signup.js'
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


// 🔹 Forgot Password - Generate Reset Token
router.post("/forgot-password", async (req, res) => {
    try {
        const { email} = req.body;
        const donor = await Donor.findOne({ email });
        console.log(email);
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
        const resetLink = `${process.env.RESET_LINK}/reset-password/?token=${resetToken}&userType=users`;
        ;

        try{
        const emailSent = await sendEmail(
          email,
          "Please reset your password here",
          `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
          );

          if(!emailSent){
            return res.status(400).json("error in sendin mail");
          }
        }catch(err){
          console.log("something went wrong in sending email");
          return res.status(500).json({message : "error found in sending mail"})
        }
  
        res.json({ message: "✅ Password reset link sent to your email!" });
  
    } catch (error) {
        res.status(500).json({ message: "❌ Server error" });
    }
  });
  
  export default router;
