const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { User } = require("../models");

// ====================================
// 🔹 Public Routes
// ====================================

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

// ====================================
// 🔒 Protected Routes (Requires JWT)
// ====================================

// ✅ Change Password Route
router.post("/update-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    // Validate new password strength
    const passRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,16}$/;
    if (!passRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8–16 chars, include 1 uppercase and 1 special symbol",
      });
    }

    // Hash and update new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashed;
    await user.save();

    res.json({ message: "✅ Password updated successfully!" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error while updating password" });
  }
});

module.exports = router;
