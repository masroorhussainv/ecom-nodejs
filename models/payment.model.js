module.exports = (sequelize, DataTypes) =>
  sequelize.define("Payment", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    transaction_id: { type: DataTypes.STRING },
  })
