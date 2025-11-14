const express = require("express");
const router = express.Router();
const { getMyStores } = require("../controllers/storeController");
const auth = require("../middlewares/auth");

// ✅ Route for store owners to get their stores
router.get("/my", auth, getMyStores);

module.exports = router;
