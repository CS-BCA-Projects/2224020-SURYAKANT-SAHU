const verifyJWT = (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid or expired token" });

        req.user = decoded;
        next();
    });
};

export {verifyJWT};