const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  //findAll is a method defined by the Sequelized package
  Product.findAll()
    .then((products) => {
      //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
      // we just complete the pathname to the templating engine here in the first argument below,
      //the second argument is the data we are passing to this view
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  //findAll is a method defined by the Sequelized package
  Product.findAll()
    .then((products) => {
      //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
      // we just complete the pathname to the templating engine here in the first argument below,
      //the second argument is the data we are passing to this view
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });

  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  //this code filters the products, and return 1 where the id matches, this is an alternative for achieving this
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));

  //findById is a method defined by the Sequelized package
  Product.findById(prodId)
    .then((product) => {
      //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
      // we just complete the pathname to the templating engine here in the first argument below,
      //the second argument is the data we are passing to this view
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        //'path 'is just an identify which can be any string, which we use to select the active
        //nav bar in the view, which is in the navigation.ejs
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //user.getCart() was possible because we defined the relation in app.js, where we said User.hasOne(Cart);
  //this method was given to use by this Sequlize package, where 'get' is appended to the begining of our model name to call it getCart,
  //and this is like a blue print where 'user.getCart' matches this relation ->   User.hasOne(Cart);  this is same for others
  //getCart was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((cartProducts) => {
          //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
          // we just complete the pathname to the templating engine here in the first argument below,
          //the second argument is the data we are passing to this view
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: cartProducts,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //user.getCart() was possible because we defined the relation in app.js, where we said User.hasOne(Cart);
  //this method was given to use by this Sequlize package, where 'get' is appended to the begining of our model name to call it getCart, this is same for others
  //and this is like a blue print 'user.getCart' matched this relation ->   User.hasOne(Cart);  this is same for others
  //getCart was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findById(prodId);
    })
    .then((product) => {
      //'through' tells the Sequelize package where the connection btwn Cart and Product should be stored
      //as we defined the relation in app.js like this ->(Cart.belongsToMany(Product, { through: CartItem });),
      //so this relation acts like a blue-print, eg this relation ->(Cart.belongsToMany(Product, { through: CartItem });)
      //is the blue print of this -> 'fetchedCart.addProduct(product, {through: { quantity: newQuantity },})'; as defined in the return statement below.
      //we are now storing that connection in this table which is cart-item, the cart-item table has a 'quantity' field
      //which we are giving it a value here
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //user.getCart() was possible because we defined the relation in app.js, where we said User.hasOne(Cart);
  //this method was given to use by this Sequlize package, where 'get' is appended to the begining of our model name to call it getCart, this is same for others
  //getCart was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  //getCart was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      //cart.getProducts(); was possible because we defined the relation in app.js, where we said Cart.belongsToMany(Product, { through: CartItem });
      //this method was given to use by this Sequlize package, where 'get' is appended to the begining of our model name to call it getProducts, this is same for others
      return cart.getProducts();
    })
    .then((products) => {
      //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
      //user.createOrder() was possible because we defined the relation in app.js, where we said User.hasMany(Order);
      //this method was given to use by this Sequlize package, where 'create' is appended to the begining of our model name to call it createOrder, this is same for others
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              //'orderItem' is the Order-Item model which we use its blue-print to create this table and it has the quantity field, the id will be added for us
              //see the relation -> Product.belongsToMany(Cart, { through: CartItem }); in the app.js which is like a blue-print;
              //the relation -> Order.belongsToMany(Product, { through: OrderItem }); matches product.orderItem = { quantity: product.cartItem.quantity };
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      //setProducts() is added  for us by the package, Sequelize, where 'set' is appended to our model name and pluralize our model name
      //from Product to Products, which here is products to give it the name setProducts
      //this method is used to set our Product models value, this method also exist for other Models, incase you see it in another code
      return fetchedCart.setProducts(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //user.getOrders({ include: ["products"] }) was possible because we defined the relation in app.js, where we said User.hasMany(Order);
  // 'include: ["products"]' was used to include the product here, because in app we realted 'Order.belongsToMany(Product, { through: OrderItem });'
  //and the product module has the name 'product' which the package Sequelize pluralizes to 'products'. this helps us fetch all related products, 
  //this works because we defined a relation between orders and products in the app.js file. -> 'Order.belongsToMany(Product, { through: OrderItem });',with this, each order will have a related product array
  //getOrders() method was given to us by this Sequlize package, where 'get' is appended to the begining of our model name to call it getCart,
  //and this is like a blue print where 'user.getOrders' matches this relation ->   'User.hasMany(Order);'  this is same for others
  //getOrders was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
      // we just complete the pathname to the templating engine here in the first argument below,
      //the second argument is the data we are passing to this view
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //user.getCart() was possible because we defined the relation in app.js, where we said User.hasOne(Cart);
  //this method was given to use by this Sequlize package, where 'get' is appended to the begining of our model name to call it getCart,
  //and this is like a blue print where 'user.getCart' matches this relation ->   User.hasOne(Cart);  this is same for others
  //getCart was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
//   // we just complete the pathname to the templating engine here in the first argument below,
//   //the second argument is the data we are passing to this view
//   res.render("shop/checkout", { path: "/checkout", pageTitle: "Checkout" });
// };
