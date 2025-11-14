const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwtSecret } = require("../config");

// 🔐 Middleware to verify token and attach user
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: "Invalid user" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
