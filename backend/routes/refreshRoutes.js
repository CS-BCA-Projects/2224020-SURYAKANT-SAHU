import express from "express";
import jwt from "jsonwebtoken";
import Donor from "../models/user_signup.js"; // User model
import Admin from "../models/admin_signup.js"; // Admin model
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const router = express.Router();

// 🔄 Refresh Token Route for Both Users & Admins
router.post("/refresh-token", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; // ⬅ Get token from cookies

        if (!refreshToken) {
            console.log("🚨 No refresh token found in cookies!");
            return res.status(403).json({ message: "❌ Refresh Token required" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log("🔹 Decoded Refresh Token:", decoded);

        let user;
        let role;

        // 🔍 Check if it's a User (Donor)
        user = await Donor.findById(decoded.userId).select("+refreshToken");
        if (user) {
            role = "user"; // ✅ Assign role
        } else {
            // 🔍 Check if it's an Admin
            user = await Admin.findById(decoded.userId).select("+refreshToken");
            if (user) {
                role = "admin"; // ✅ Assign role
            }
        }

        if (!user) {
            console.log("🚨 User/Admin not found in database!");
            return res.status(403).json({ message: "❌ User/Admin not found!" });
        }

        if (user.refreshToken !== refreshToken) {
            console.log("🚨 Mismatched refresh token! Possible old token.");
            return res.status(403).json({ message: "❌ Invalid Refresh Token" });
        }

        // Generate new access token with role
        const newAccessToken = generateAccessToken(user, role);

        console.log(`✅ Refresh successful! New Access Token for ${role}:`, newAccessToken);

        // Set new access token in cookies
        res.status(200)
            .cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: "None" })
            .json({ accessToken: newAccessToken, role });

    } catch (error) {
        console.error("🚨 Refresh Token Error:", error.message);
        return res.status(403).json({ message: "❌ Token Expired or Invalid" });
    }
});

export default router;
