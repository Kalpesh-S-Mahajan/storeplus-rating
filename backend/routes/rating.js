const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

// Normal users
router.post(
  "/submit",
  auth,
  requireRole("normal"),
  ratingController.submitRating
);
router.get("/stores", auth, requireRole("normal"), ratingController.listStores);

// Store owners
router.get(
  "/store/:storeId",
  auth,
  requireRole("store_owner"),
  ratingController.getStoreRatings
);

module.exports = router;
