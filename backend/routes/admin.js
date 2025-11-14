const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

// 🔐 Only admin can access all routes here
router.use(auth, requireRole("admin"));

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// User Management
router.get("/users", adminController.getUsers); // List users + filters
router.get("/users/:id", adminController.getUserById); // Single user
router.post("/users", adminController.createUser); // Create user

// Store Management
router.get("/stores", adminController.getStores); // List stores + filters
router.get("/stores/:id", adminController.getStoreById); // Single store
router.post("/stores", adminController.createStore); // Create store

module.exports = router;
