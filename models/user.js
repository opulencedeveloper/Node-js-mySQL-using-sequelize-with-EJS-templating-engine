const Sequelize = require("sequelize");

const sequelize = require("../util/database");

//'user' is the model name, you can give it any name you want, when this table is created
//'user' will be named to users by the Package, Sequelize 
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = User;
