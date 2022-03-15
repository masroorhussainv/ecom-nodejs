module.exports = (sequelize, DataTypes) =>
  sequelize.define("Order", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: DataTypes.STRING,
  })
