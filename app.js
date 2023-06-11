const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const rootDir = require("./util/path");
const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");


const app = express();

//Sets our app to use the handlebars view engine, here we named it 'hbs' which will be the extenstion name
app.set("view engine", "ejs");
//this sets the folder where the templating engines will be stored(this is the default folder but I just set it here to make it clear)
//the first argument has to be called views, the second argument is
//the name of the folder or path to where the templating engine file are kept
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

//do this before your route middleware if you want to parse the incoming request body
//there are types of body parser to use, eg the one for files, check other gitHub repo or files.
//The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true).
//extended” allows for rich objects and arrays to be encoded into the URL-encoded format,
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  User.findById(1)
    .then((user) => {
      //we are storing the user Obj in this specific request obj.
      //so we can access globally for this specific request.
      //user Obj does not only contain this user data but utility methods
      //like (findAll, findbyId) which was added by the Sequalize package
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//this routes serves static files like CSS
//it allows access to the folder specified here
//it takes any request that is trying to find a file and forwards it to the
//path specified here, you can specify more paths
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//catch all routes middle-ware, incase non of the routes matches, normally used for 404 pages
app.use(errorController.get404);

//this is called a relation(association) that relates(associates) a table to another table.
//'onDelete: 'CASCADE''  means that if you delete a user, all the product that the User
//created will also be deleted, each relation adds a field 'userId' to use to identify(relate)
//the user that created a product,
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);

//the relation  (Cart.belongsTo(User))below is optional, since we have related it above, 1 direction relation is enough , I just added it here for readability
Cart.belongsTo(User);

//'through' tells the Sequelize package where the connection btwn Cart and Product should be stored , which is the inbetween table(CartItem)
//so CartItem is the in between table associating, Cart and Product
Cart.belongsToMany(Product, { through: CartItem });

//'through' tells the Sequelize package where the connection btwn Product and Cart should be stored , which is the inbetween table(CartItem)
//so CartItem is the in between table associating, Cart and Product
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);

//'through' tells the Sequelize package where the connection btwn Order and Product should be stored, which is the inbetween table(OrderItem)
//so OrderItem is the in between table associating, Order and Product
Order.belongsToMany(Product, { through: OrderItem });

//this goes to your model folder, since that is where you defined your models, and converts it into
//a table.
//.sync({force: true}) will always overwrite the existing table when this file runs
sequelize
  //.sync({force: true})
  .sync()
  .then((result) => {
    return User.findById(1);
    //console.log(result);
  })
  .then((user) => {
    //dummy USER
    if (!user) {
      return User.create({ name: "Victor", email: "test@test.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    //console.log(user);
    //since we defined a relation in this file where 'Cart.belongsTo(User);'.
    //a createCart method was added by the Sequelize package, it is called createCart
    //because your cart model in the model folder is named Cart, if your cart model
    //name was called MyCart then this fn will be called createMyCart.
    //this method is now added to the user Object by the Sequelize package, we do this to create
    //a cart table for this user with a userID field is added added, since we defined a relation between Cart and User 
    //above, so the table is available, if the cart table is already there, it won't create the table
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
