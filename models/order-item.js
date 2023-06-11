const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//'orderItem' is the model name, you can give it any name you want, when this table is created,
//'orderItem' will be named to orderItems by the Package, Sequelize.
const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = OrderItem;
