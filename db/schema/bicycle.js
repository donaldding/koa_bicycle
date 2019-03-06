'use strict'

module.exports = (sequelize, DataTypes) => {
  const Bicycle = sequelize.define(
    'Bicycle', {
      num: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      state: DataTypes.STRING,
      price: DataTypes.INTEGER,
      location: DataTypes.GEOMETRY('POINT'),
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      servicePointId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ServicePoints',
          key: 'id'
        }
      }
    }, {
      hooks: {
        beforeSave: instance => {
          if (instance.location) return
          instance.location = {
            type: 'Point',
            coordinates: [instance.lng, instance.lat]
          }
        }
      }
    }
  )
  Bicycle.associate = function (models) {
    Bicycle.belongsTo(models['User'], {
      foreignKey: 'userId'
    })
    Bicycle.belongsTo(models['ServicePoints'], {
      foreignKey: 'servicePointId'
    })
  }
  return Bicycle
}