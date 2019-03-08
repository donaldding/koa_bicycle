'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Orders', 'orderNum', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
  },

  down: (queryInterface, Sequelize) => {

  }
};