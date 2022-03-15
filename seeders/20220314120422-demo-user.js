"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          email: "demo@demo.com",
          password: "asa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "John Doe",
          email: "demo@demo.com",
          password: "asa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
}
