const path = require("path");
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config");

const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const adminRoutes = require("./routes/admin");
const ratingRoutes = require("./routes/rating");
const storeRoutes = require("./routes/storeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/store", storeRoutes);

// Serve frontend build (Vite)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Fallback route (Express 5 regex)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("📦 Database connected successfully");

    await sequelize.sync();

    const PORT = process.env.PORT || config.port;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
