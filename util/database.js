const Sequelize = require('sequelize');

const sequelize = new Sequelize('opulence-db', 'root', 'input-passsword-here', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;


//******THE FOLLOWING CODE BELOW IS HOW MY SQL WORKS, BUT THE PACKAGE WE USED ABOVE DOES THIS FOR US BEHING THE SCENE
//THIS PACKAGE ALSO USES MYSQL PACKAGE BEHIND THE SCENE

//an alternative to 'mysql.createPool()' is 'mySql.createConnection()', which creates a single connect for every query(CRUD operation),
//and you close it when youre done, if you want to run another query or the same query since youve closed
//the connection, you create another connection and close it again, and this is inefficient if you do
// this all the time and it affect performance
//'mySql.createPool' creates a pool of connetion, which you always reach out to it, whenever we have a query(CRUD operation)
//to run and get a new connection, not create but get a new connection from the pool which managed multiple connections.
//so you can run mutiple queries(CRUD) simultaneously because each query(CRUD) will get its own connection.
//this pool closes when our application shuts down

// const connectionPool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "opulence-db",
//   password: "", //input your db pasword
// });

// module.exports = pool.promise();
