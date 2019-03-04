'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Bicycles', 'location', {
      type: Sequelize.GEOMETRY('POINT')
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Bicycles', 'location')
  }
}
