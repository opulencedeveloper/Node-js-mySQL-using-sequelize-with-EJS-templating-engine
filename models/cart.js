const Sequelize = require("sequelize");

const sequelize = require("../util/database");

//'cart' is the model name, you can give it any name you want, when this table is created
//'cart' will be named to carts by the Package, Sequelize
//This cart model only holds the id of the different cart for each user.
//The Cart Items for each user Cart is stored in Cart-Item module in cart-item file
//watch the video that explained this if you don't understand
const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
