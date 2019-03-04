'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bicycle = sequelize.define('Bicycle', {
    num: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    state: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {});
  Bicycle.associate = function(models) {
    // associations can be defined here
  };
  return Bicycle;
};