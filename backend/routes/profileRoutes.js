import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Donor from "../models/user_signup.js";
import Request from "../models/request .js";
import Donorregister from "../models/donorregisterform.js"; // Import Donorregister model

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
    }
    catch(error){
         console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
})
export default router;
