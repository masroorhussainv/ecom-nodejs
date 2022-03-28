"use strict"
const encryptPassword = require("../utils/encryptPassword.util")

module.exports = {
  async up(queryInterface, Sequelize) {
    let password = await encryptPassword("123456")
    password = password.hash

    return queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "Admin",
          email: "admin@mailinator.com",
          password,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {})
  },
}
