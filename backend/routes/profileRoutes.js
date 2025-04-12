import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Donor from "../models/user_signup.js";
import Request from "../models/request.js";
import Donorregister from "../models/donorregisterform.js"; // Import Donorregister model
import sendEmail from '../utils/send_mail.js';

const router = express.Router();

// 🔹 Render User Profile Page
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        // Fetch user data from the database using JWT user ID
        const donor = await Donor.findById(req.user.userId).select("-Password"); // Exclude password
        
        if (!donor) {
            return res.status(404).json({ message: "❌ User not found" });
        }
        
        // Fetch donor's additional details from Donorregister
        const donorDetails = await Donorregister.findOne({userId: req.user.userId });
        
        if (!donorDetails) {
            return res.render("userprofile", { user: donor, userinfo: "" }); // If no additional details found
        }

        // Render EJS page with user data
        res.render("userprofile", { user: donor,userinfo:donorDetails});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
});
router.get("/request", authenticateUser, async (req, res) =>{
    try{
       const requester = await Request.find({requestedTo: req.user.userId }); 
        console.log(requester)
        res.render('blood_requests',{requester})
    }
    catch(error){
         console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
})

router.post("/requests/:id/accept", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    const donor =await Donorregister.findOne({userId: request.requestedTo }); ;
    console.log("this is donor detail:",donor);
     const emailSent = await sendEmail (
      request.email,
      "Blood Request Accepted",
      `<h3>Dear ${request.name}</h3>,

        <p>Your blood request has been accepted!</p>
        
       <div> Here are the donor's details:
        - Name: ${donor.First_Name}
        - Email: ${donor.Email}
        - Contact No: ${donor.ContactNo}
        - Address: ${donor.State},${donor.District},${donor.Block},${donor.Pincode} || "Not Provided"}</div>
        
        <p>Please contact the donor as soon as possible.</p>
        
        Thank you,
        Bloodlink.com
        `
                );

    // Optional: Delete the request after handling
    await Request.findByIdAndDelete(req.params.id);

    res.json({ message: "Request accepted and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing acceptance." });
  }
});

// ❌ REJECT REQUEST
router.post("/requests/:id/reject", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    const donor =await Donorregister.findOne({userId: request.requestedTo }); ;

    const emailSent = await sendEmail (
      request.email,
      "Blood Request rejected",
      `<h3>Dear ${request.name}</h3>,

<p>We regret to inform you that your blood request has been rejected by the $(donor.First_Name) $(donor.Last_Name)</p> .

<p>You may try contacting other donors through the system.</p>

Regards,
Blood Donation System
      `,
    );

    await transporter.sendMail(mailOptions);

    // Optional: Delete the request after handling
    await Request.findByIdAndDelete(req.params.id);

    res.json({ message: "Request rejected and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing rejection." });
  }
});
export default router;
