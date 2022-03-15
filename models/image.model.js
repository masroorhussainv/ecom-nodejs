module.exports = (sequelize, DataTypes) =>
  sequelize.define("Image", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: DataTypes.STRING,
  })
