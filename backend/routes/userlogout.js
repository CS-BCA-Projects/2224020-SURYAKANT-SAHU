import express from 'express'
const router = express.Router();
import Donor from '../models/user_signup.js'


router.post("/logout", async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(403).json({ error: "Refresh token required" });

    try {
        // Remove refresh token from the database
        await Donor.findOneAndUpdate({ refreshToken }, { refreshToken: null });

        res.clearCookie("refreshToken");
        res.json({ msg: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
export default router;