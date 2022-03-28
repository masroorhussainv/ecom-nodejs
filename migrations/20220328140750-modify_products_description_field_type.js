"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Products", "description", {
      type: Sequelize.TEXT,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "description")
  },
}
