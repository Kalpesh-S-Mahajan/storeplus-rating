const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    logging: false,
  }
);

const db = {};
const files = fs.readdirSync(__dirname).filter((file) => file !== "index.js");

for (const file of files) {
  const model = require(path.join(__dirname, file))(sequelize, DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
