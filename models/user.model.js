module.exports = (sequelize, DataTypes) =>
  sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    reset_token: DataTypes.STRING,
  })
