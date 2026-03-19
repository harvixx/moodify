const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    try {
        // 🔹 1. Check cookie
        if (!req.cookies || !req.cookies.accessToken) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });
        }

        const token = req.cookies.accessToken;

        // 🔹 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔹 3. Attach minimal user
        req.user = { id: decoded.id };

        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = protect;