'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderNum: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: DataTypes.INTEGER,
    leaseTime: DataTypes.STRING,
    returnTime: DataTypes.STRING,
    total: DataTypes.INTEGER,
    bicycleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Bicycles',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {});
  Order.associate = function (models) {
    // associations can be defined here
    Order.belongsTo(models['User'], {
      foreignKey: 'userId'
    })
    Order.belongsTo(models['Bicycle'], {
      foreignKey: 'bicycleId'
    })
  };
  return Order;
};