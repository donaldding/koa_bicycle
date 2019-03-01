'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'balance', {
      type: Sequelize.INTEGER
    })
    queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING
    }) 
    return queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING
    })
      
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'balance')
    queryInterface.removeColumn('Users', 'avatar')
    return queryInterface.removeColumn('Users', 'gender')
  }
};
