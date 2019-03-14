'use strict';
module.exports = (sequelize, DataTypes) => {
  const ServicePoints = sequelize.define('ServicePoints', {
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    bicycleCount: DataTypes.INTEGER
  }, {});
  ServicePoints.associate = function (models) {
    ServicePoints.hasMany(models['Bicycle'], {
      foreignKey: 'servicePointId'
    })
  };
  return ServicePoints;
};