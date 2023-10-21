'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Books', [{
      title: 'How to Kill a Mocking Bird',
      author: 'Harper Lee',
      isbn: '1234567891234',
      availability: true,
      shelfLocation: '2A',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Books', null, {});
  }
};
