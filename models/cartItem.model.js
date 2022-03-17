const { Cart, Product } = require(".")

module.exports = (sequelize, DataTypes) =>
  sequelize.define("CartItem", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cart_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Cart,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.FLOAT,
    },
  })
