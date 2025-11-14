module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      rating: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
    },
    {
      tableName: "ratings",
      underscored: true,
    }
  );

  Rating.associate = (models) => {
    Rating.belongsTo(models.User, { foreignKey: "user_id" });
    Rating.belongsTo(models.Store, { foreignKey: "store_id" });
  };

  return Rating;
};
