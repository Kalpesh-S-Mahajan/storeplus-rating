const { Rating, Store, User } = require("../models");

// Submit or update a rating
exports.submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });

    // Update if already rated
    const existing = await Rating.findOne({
      where: { store_id, user_id: req.user.id },
    });

    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({
        message: "Rating updated successfully",
        rating: existing,
      });
    }

    const newRating = await Rating.create({
      store_id,
      user_id: req.user.id,
      rating,
    });

    res.status(201).json({ message: "Rating submitted", rating: newRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// List all stores with average rating
exports.listStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: [
        "id",
        "name",
        "address",
        [
          Store.sequelize.literal(`(
            SELECT AVG(rating)
            FROM ratings
            WHERE ratings.store_id = Store.id
          )`),
          "average_rating",
        ],
      ],
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get ratings for a specific store (Store Owner)
exports.getStoreRatings = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const store = await Store.findByPk(storeId, {
      include: [{ model: Rating, include: [User] }],
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
