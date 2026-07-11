const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;
        console.log("Received Header:", req.headers.authorization);
        console.log("JWT Secret:", process.env.JWT_SECRET);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided"
            });

        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (error) {

        console.log("JWT Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};

module.exports = protect;