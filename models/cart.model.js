module.exports = (sequelize, DataTypes) =>
  sequelize.define("Cart", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  })
