module.exports = (sequelize, DataTypes) =>
  sequelize.define("Product", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
  })
