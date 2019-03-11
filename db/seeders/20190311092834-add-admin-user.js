'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'admin1',
      cellphone: '13715459293',
      password: '$2a$10$/nGc1ng4NWlW1pMLA.I3Xuzk0Qvy1fw4jpfdrHxtlH8cR1aDpsmV.',
      is_admin: true,
      gender: 'f',
      createdAt: '2019-03-11T09:41:11.860Z',
      updatedAt: '2019-03-11T09:41:11.860Z'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};