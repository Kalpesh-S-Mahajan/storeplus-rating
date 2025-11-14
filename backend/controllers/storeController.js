const { Store } = require("../models");

// ✅ Get stores owned by the logged-in user
exports.getMyStores = async (req, res) => {
  try {
    const userId = req.user.id;

    const stores = await Store.findAll({
      where: { owner_id: userId },
    });

    if (!stores.length) {
      return res.status(200).json([]); // Return empty array if no stores
    }

    res.json(stores);
  } catch (err) {
    console.error("Error fetching owner stores:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
