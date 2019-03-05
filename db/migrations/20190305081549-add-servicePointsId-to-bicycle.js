'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Bicycles', 'servicePointId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ServicePoints',
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Bicycles', 'servicePointId')
  }
};