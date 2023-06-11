const Sequelize = require('sequelize');

const sequelize = require('../util/database');

//'order' is the model name, you can give it any name you want, when this table is created
//'order' will be named to orders by the Package, Sequelize.
//This order model only holds the id of the different order for each user.
//The Order Items for each user Order is stored in Order-Item module in order-item file,
//you can include an address field here if you want
//watch the video that explained this if you don't understand
const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;
