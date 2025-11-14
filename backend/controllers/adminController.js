const { User, Store, Rating } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config");

// ======================
// 📊 Admin Dashboard
// ======================
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// 👤 Create User
// ======================
exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!["admin", "normal", "store_owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      address,
      role,
      password_hash: hash,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// 🔍 Get Users + Filters
// ======================
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "address", "role"],
      order: [["id", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// 👤 Get User by ID
// ======================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "name", "email", "address", "role"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // If store owner → include average rating
    if (user.role === "store_owner") {
      const store = await Store.findOne({
        where: { owner_id: user.id },
        include: [{ model: Rating }],
      });

      if (store) {
        const avg =
          store.Ratings.length > 0
            ? (
                store.Ratings.reduce((a, b) => a + b.rating, 0) /
                store.Ratings.length
              ).toFixed(2)
            : null;

        return res.json({ ...user.toJSON(), rating: avg });
      }
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// 🏬 Create Store
// ======================
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    const owner = await User.findByPk(owner_id);

    if (!owner || owner.role !== "store_owner") {
      return res.status(400).json({
        message: "Owner must be an existing user with role store_owner",
      });
    }

    const store = await Store.create({ name, email, address, owner_id });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// 🏬 Get Stores + Filters
// ======================
exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;

    const where = {};

    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (address) where.address = { [Op.like]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating }],
      order: [["id", "DESC"]],
    });

    // add average_rating
    const formatted = stores.map((s) => {
      const avg =
        s.Ratings.length > 0
          ? (
              s.Ratings.reduce((sum, r) => sum + r.rating, 0) / s.Ratings.length
            ).toFixed(2)
          : null;

      return {
        id: s.id,
        name: s.name,
        address: s.address,
        email: s.email,
        owner_id: s.owner_id,
        average_rating: avg,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// 🏬 Get Store by ID
// ======================
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [{ model: Rating }],
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    const avg =
      store.Ratings.length > 0
        ? (
            store.Ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.Ratings.length
          ).toFixed(2)
        : null;

    res.json({ ...store.toJSON(), average_rating: avg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
