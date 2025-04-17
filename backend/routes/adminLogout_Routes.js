import express from 'express';
import Admin from '../models/admin_signup.js';

const router = express.Router();

router.post("/logout", async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(403).json({ error: "Refresh token required" });
        }

        // Remove refresh token from the database
        await Admin.findOneAndUpdate({ refreshToken }, { refreshToken: null });

        // Clear the cookie and send success response
        res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "strict",path:"/" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "strict",path:"/" });
        return res.status(200).json({ success: true, msg: "Logged out successfully" });

    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
