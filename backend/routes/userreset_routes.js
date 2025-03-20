import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Donor from '../models/user_signup.js'

const router = express.Router();

// 🔹 Reset Password - Update Database
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
  
        // 🔸 Decode Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const donor = await Donor.findOne({ _id: decoded.id, resetToken: token });
  
        if (!donor) {
            return res.status(400).json({ message: "❌ Invalid or expired token!" });
        }
        if (donor.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: "❌ Token has expired!" });
        }
        
  
        // 🔸 Hash New Password & Replace Old Password
        const hashedPassword = await bcrypt.hash(password, 10);
        donor.password = hashedPassword;  // 🔥 Old password replaced
        donor.resetToken = null;
        donor.resetTokenExpiry = null;
        await donor.save();
  
        res.json({ message: "✅ Password reset successful! You can now log in." });
  
    } catch (error) {
        res.status(500).json({ message: "❌ Error resetting password!" });
    }
  });
  

  export default router;