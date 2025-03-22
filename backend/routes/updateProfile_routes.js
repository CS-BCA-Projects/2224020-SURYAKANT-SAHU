import express from "express";
import Donorregister from "../models/donorregisterform.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to update user profile
router.post("/updateprofile", authenticateUser, async (req, res) => {
    try {
        const userid = req.user.userId; // Get user ID from session/auth
        
        const {
            name,
            bloodGroup,
            email,
            phone,
            birth,
            age,
            gender,
            weight,
            profession,
            address
        } = req.body;
        
        // Find the existing user
        const existingUser = await Donorregister.findOne({ userId: userid });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the email is being changed
        if (email && email !== existingUser.Email) {
            const emailExists = await Donorregister.findOne({ Email: email });

            if (emailExists) {
                return res.status(400).json({ success: false, message: "Email already exists. Please use another email." });
            }
        }

        // Split name into first and last (assuming single space between)
        const nameParts = name.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        // Split address into state, district, block, and pincode
        const addressParts = address.split(", ");
        const state = addressParts[0] || "";
        const district = addressParts[1] || "";
        const block = addressParts[2] || "";
        const pincode = addressParts[3] || "";

        // Update the user's profile (without changing email if not modified)
        const updatedUser = await Donorregister.findOneAndUpdate(
            { userId: userid }, // Find user by ID
            {
                First_Name: firstName,
                Last_Name: lastName,
                BloodGroup: bloodGroup,
                ContactNo: phone,
                DOB: birth,
                Age: age,
                Gender: gender,
                Weight: weight,
                Profession: profession,
                State: state,
                District: district,
                Block: block,
                Pincode: pincode,
                ...(email && email !== existingUser.Email && { Email: email }) // Only update email if changed
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Profile updated successfully!", user: updatedUser });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ success: false, message: "Error updating profile. Please try again." });
    }
});

export default router;
