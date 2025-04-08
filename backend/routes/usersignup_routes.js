// In subfolder file
import express from 'express'
import bcrypt from 'bcryptjs'
import Donor from '../models/user_signup.js'
import sendEmail from '../utils/send_mail.js';

const router = express.Router();


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
    if (donor) return res.status(400).json({ msg: "User already exists",redirecturl:"/users/login" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    donor = new Donor({ username, email, password: hashedPassword });

    await donor.save();

    const emailSent = await sendEmail (
      email,
      "Thankyou for sigining in Blood Donation",
      `<p>You are successfully registered for blood donation</p>`
    );

    if(!emailSent){
      return res.status(400).json({message : "email sending error"});
    }

    res.status(201).json({ msg: "User signup successfully",redirecturl:"/donor/donorform" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
