import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import Admin from "../models/admin_signup.js";
import Donorregister from "../models/donorregisterform.js";
import sendEmail from '../utils/send_mail.js';

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
// PATCH /admin/donors/approve/:userId
router.patch('/approve', async (req, res) => {
    try {
        const { userId, email } = req.query;

        // Update donor to verified
        const updated = await Donorregister.findOneAndUpdate(
            { userId: userId },
            { isVerifyed: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Donor not found" });
        }

        // Send approval email
        await sendEmail(
            email,
            "Registration Approved",
            `<p>You have been successfully approved for blood donation by <strong>BloodLink</strong>. Thank you for registering!</p>`
        );

        res.status(200).json({ message: "Donor approved successfully", donor: updated });
    } catch (err) {
        console.error("Approval Error:", err);
        res.status(500).json({ error: "Approval failed. Please try again later." });
    }
});


// DELETE /admin/donors/reject/:userId
router.delete('/reject?userId=${userId}&email=${encodeURIComponent(email)}', async (req, res) => {
    try {
        const { userId, email } = req.query;

        const deleted = await Donorregister.findOneAndDelete({ userId: userId });

        if (!deleted) {
            return res.status(404).json({ error: "Donor not found" });
        }

        // Send rejection email before responding
        await sendEmail(
            email,
            "Registration Rejected",
            `<p>Your registration for blood donation has been <strong>rejected</strong> by BloodLink. 
            Please ensure that all information provided is accurate. Thank you.</p>`
        );

        res.status(200).json({ message: "Donor rejected and removed" });

    } catch (err) {
        console.error("Rejection Error:", err);
        res.status(500).json({ error: "Rejection failed" });
    }
});


export default router;
