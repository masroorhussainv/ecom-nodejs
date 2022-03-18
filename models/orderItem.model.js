const { Order, Product } = require(".")

module.exports = (sequelize, DataTypes) =>
  sequelize.define("OrderItem", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Order,
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
