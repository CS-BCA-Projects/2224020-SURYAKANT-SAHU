import express from "express";
import Donorregister from "../models/donorregisterform.js";
import sendEmail from '../utils/send_mail.js';
import {authenticateUser} from "../middlewares/authMiddleware.js"; 

const router = express.Router(); // FIXED: use express.Router()

router.post("/donorform", authenticateUser,async (req, res) => {
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
    const userId = req.user.userId;
    // Check if donor already exists
    const existingDonor = await Donorregister.findOne({ userId });
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
    const emailSent = await sendEmail (
      Email,
       "Thank You for Registering as a Donor",
       "Request submitted! Pending admin approval."
    );

    res.status(201).json({ msg: "Request submitted! Pending admin approval." });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;
