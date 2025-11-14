const { sequelize } = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  } finally {
    await sequelize.close();
  }
})();
