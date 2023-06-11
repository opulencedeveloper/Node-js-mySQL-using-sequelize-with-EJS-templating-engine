const Sequelize = require('sequelize');

const sequelize = new Sequelize('opulence-db', 'root', 'input-passsword-here', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;


// const connectionPool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "opulence-db",
//   password: "", //input your db pasword
// });

// module.exports = pool.promise();
