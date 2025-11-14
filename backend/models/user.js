module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING(60), allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING(400) },
      role: {
        type: DataTypes.ENUM("admin", "normal", "store_owner"),
        defaultValue: "normal",
      },
    },
    {
      tableName: "users",
      underscored: true,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Store, { foreignKey: "owner_id" });
    User.hasMany(models.Rating, { foreignKey: "user_id" });
  };

  return User;
};
