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
router.patch('/approve/:userId/:email', async (req, res) => {
    try {
        const { userId, email } = req.params;

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
router.delete('/reject/:userId/:email', async (req, res) => {
    try {
        const deleted = await Donorregister.findOneAndDelete({ userId: req.params.userId });
        const email=req.params.email;
        if (!deleted) {
            return res.status(404).json({ error: "Donor not found" });
        }

        res.json({ message: "Donor rejected and removed" });
      const emailSent = await sendEmail (
      email,
      "Registeration rejected",
      `<p>You are Rejected for blood donation you are not approved for blood donation by bloodlink.
      please input correct information thankyou
      </p>`
    );
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Rejection failed" });
    }
});

export default router;
