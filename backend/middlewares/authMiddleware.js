import jwt from "jsonwebtoken";

const authenticateUser = async (req, res, next) => {
    let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ msg: "❌ Access Denied: No token provided" });
    }

    try {
        // Verify the token
        console.log("🔹 Checking token...");
        console.log("Token:", token);
        console.log("JWT Secret:", process.env.JWT_SECRET);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded Token:", decoded);

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                console.log("🔄 Token expired. Requesting new access token...");

                // Request a new access token using fetch
                const refreshResponse = await fetch("http://localhost:5000/api/refresh-token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Cookie: req.headers.cookie // Send cookies for refresh token
                    },
                    credentials: "include" // Ensures cookies are sent
                });

                const data = await refreshResponse.json();

                if (!refreshResponse.ok) {
                    throw new Error(data.msg || "Failed to refresh token");
                }

                console.log("✅ New Access Token Received:", data.accessToken);

                // Update the token in request headers
                req.cookies.accessToken = data.accessToken;
                req.headers.authorization = `Bearer ${data.accessToken}`;

                // Verify the new token
                const decoded = jwt.verify(data.accessToken, process.env.JWT_SECRET);
                req.user = decoded;
                next();
            } catch (refreshError) {
                console.error("🚨 Refresh Token Error:", refreshError);
                return res.status(401).json({ msg: "❌ Refresh Token Expired. Please login again." });
            }
        } else {
            console.error("🚨 Invalid Token Error:", error);
            return res.status(401).json({ msg: "❌ Invalid Token" });
        }
    }
};

export { authenticateUser };
