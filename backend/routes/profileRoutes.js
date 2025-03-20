import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import Donor from "../models/user_signup.js";

const router = express.Router();

// 🔹 Render User Profile Page
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        // Fetch user data from the database using JWT user ID
        const donor = await Donor.findById(req.user.id).select("-Password,-refreshToken"); // Exclude password

        if (!donor) {
            return res.status(404).json({ message: "❌ User not found" });
        }

        // Render EJS page with user data
        res.render("userprofile", { user: donor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

export default router;
