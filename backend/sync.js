const { sequelize } = require("./models");

(async () => {
  try {
    await sequelize.sync({ force: true });

    console.log("✅ All models synced successfully with MySQL!");
  } catch (err) {
    console.error("❌ Model sync failed:", err);
  } finally {
    await sequelize.close();
  }
})();
