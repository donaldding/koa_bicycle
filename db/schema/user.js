'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    cellphone: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};