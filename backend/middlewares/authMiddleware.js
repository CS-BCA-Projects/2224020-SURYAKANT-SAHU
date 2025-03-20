
import jwt from "jsonwebtoken";
import axios from "axios";

export const authenticateUser = async (req, res, next) => {
    let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.alert("❌ Access Denied: No token provided")
        .redirect("http://localhost:5000/users/login"); 
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                // 🔄 Automatically request a new access token
                const refreshResponse = await axios.post(
                    "http://localhost:5000/api/refresh-token", 
                    {}, 
                    { headers: { Cookie: req.headers.cookie }, withCredentials: true }
                );

                // Set the new access token in the request
                req.cookies.accessToken = refreshResponse.data.accessToken;
                req.headers.authorization = `Bearer ${refreshResponse.data.accessToken}`;

                // Verify the new token
                const decoded = jwt.verify(refreshResponse.data.accessToken, process.env.JWT_SECRET);
                req.user = decoded;
                next();
            } catch (refreshError) {
                return res.alert("❌ Refresh Token Expired. Please login again.")
                .redirect("http://localhost:5000/users/login"); 
            }
        } else {
             return res.alert("❌ Invalid Token")
            .redirect("http://localhost:5000/users/login"); 
        }
    }
};
