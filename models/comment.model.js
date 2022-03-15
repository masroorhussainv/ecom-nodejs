module.exports = (sequelize, DataTypes) =>
  sequelize.define("Comment", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    description: DataTypes.STRING,
  })
