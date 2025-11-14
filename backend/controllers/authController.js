const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const validators = require("../utils/validators");
const { jwtSecret, saltRounds } = require("../config");

// User signup
exports.signup = async (req, res) => {
  try {
    const { error } = validators.signup.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { name, email, address, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      name,
      email,
      address,
      password_hash: hash,
      role: "normal",
    });

    return res
      .status(201)
      .json({
        message: "Signup successful",
        user: { id: user.id, email: user.email },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { error } = validators.login.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
