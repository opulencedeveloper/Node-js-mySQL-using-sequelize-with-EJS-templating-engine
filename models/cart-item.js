const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//'cartItem' is the model name, you can give it any name you want, when this table is created
//'cartItem' will be named to cartItems by the Package, Sequelize
const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER
});

module.exports = CartItem;
