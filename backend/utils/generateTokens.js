import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    try {
        return jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
    } catch (error) {
        console.error("Error generating access token:", error);
        return null; // Handle token generation failure
    }
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: "10d" } // Long-lived (10 days)
    );
};
