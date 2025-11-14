require("dotenv").config();

module.exports = {
  port: process.env.PORT || 4000,
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql", // 👈 use MySQL since you're on XAMPP
  },
  jwtSecret: process.env.JWT_SECRET,
  saltRounds: parseInt(process.env.SALT_ROUNDS || "10", 10),
};
