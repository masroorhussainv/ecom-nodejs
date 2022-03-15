module.exports = (sequelize, DataTypes) =>
  sequelize.define("CouponCode", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: DataTypes.STRING,
    discount: DataTypes.FLOAT,
  })
