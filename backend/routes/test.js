const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

router.get("/protected", auth, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, you are a ${req.user.role}` });
});

router.get("/admin", auth, requireRole("admin"), (req, res) => {
  res.json({ message: "Hello Admin, this route is protected for you only!" });
});

module.exports = router;
