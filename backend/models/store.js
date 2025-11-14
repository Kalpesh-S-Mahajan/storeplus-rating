module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define(
    "Store",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING(400) },
    },
    {
      tableName: "stores",
      underscored: true,
    }
  );

  Store.associate = (models) => {
    Store.belongsTo(models.User, { as: "owner", foreignKey: "owner_id" });
    Store.hasMany(models.Rating, { foreignKey: "store_id" });
  };

  return Store;
};
