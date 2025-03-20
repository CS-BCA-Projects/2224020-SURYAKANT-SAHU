import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/admin_signup.js';

const router = express.Router();

// 🔹 Reset Password - Update Database (For Admins)
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // 🔸 Decode Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded.id, resetToken: token });

        if (!admin) {
            return res.status(400).json({ message: "❌ Invalid or expired token!" });
        }
        if (admin.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "❌ Token has expired!" });
        }

        // 🔸 Hash New Password & Replace Old Password
        const hashedPassword = await bcrypt.hash(password, 10);
        admin.Password = hashedPassword;  // 🔥 Old password replaced
        admin.resetToken = null;
        admin.resetTokenExpiry = null;
        await admin.save();

        res.json({ message: "✅ Password reset successful! You can now log in." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Error resetting password!" });
    }
});

export default router;
