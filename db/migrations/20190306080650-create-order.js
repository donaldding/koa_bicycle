'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      orderNum: {
        type: Sequelize.INTEGER,
        unique: true
      },
      price: {
        type: Sequelize.INTEGER
      },
      leaseTime: {
        type: Sequelize.DATE
      },
      returnTime: {
        type: Sequelize.DATE
      },
      total: {
        type: Sequelize.INTEGER
      },
      bicycleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Bicycles',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  }
};