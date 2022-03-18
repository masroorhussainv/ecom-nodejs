module.exports = (sequelize, DataTypes) =>
  sequelize.define("Cart", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    total: { type: DataTypes.DOUBLE },
    total_before_discount: { type: DataTypes.DOUBLE },
    coupon_code: DataTypes.STRING,
  })
