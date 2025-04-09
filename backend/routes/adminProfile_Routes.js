import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Admin from "../models/admin_signup.js";
import Donorregister from "../models/donorregisterform.js";

const router = express.Router();

// 🔹 Render User Profile Page
router.get("/adminprofile", authenticateUser, async (req, res) => {
    try {
        // Fetch user data from the database using JWT user ID
        const admin = await Admin.findOne(req.user._id).select("-Password"); // Exclude password
        const donors = await Donorregister.find();
        console.log(donors);
        
        
        if (!admin) {
            return res.status(404).json({ message: "❌ admin not found" });
        }
                
        // Render EJS page with user data
        res.render("admin", { user: admin, donors : donors});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
});
// Approve donor
router.patch('/approve/:id', async (req, res) => {
    try {
        await Donorregister.findByIdAndUpdate(req.params.id, { isVerified: true });
        res.json({ message: 'Donor approved' });
    } catch (err) {
        res.status(500).json({ error: 'Approval failed' });
    }
});


// Reject donor
router.delete('/reject/:id', async (req, res) => {
    try {
        await Donorregister.findByIdAndDelete(req.params.id);
        res.json({ message: 'Donor rejected and removed' });
    } catch (err) {
        res.status(500).json({ error: 'Rejection failed' });
    }
});


export default router;
