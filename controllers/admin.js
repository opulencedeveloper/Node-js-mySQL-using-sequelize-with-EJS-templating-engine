const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //in app.js since we have already set a path to the folder(view) where the templating engine files is stored.
  //we just complete the pathname to the templating engine here in the first argument below,
  //the second argument is the data we are passing to this view
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //this method was given to use by this Sequlize package, where get is appended to the begining of our model name to call it getProducts, this is same for others
   //user.getProducts() was possible because we defined the relation in app.js, where we said 'User.hasMany(Product);'
  //and this is like a blue print where 'user.getProducts()' matches this relation ->   'User.hasMany(Product);'  this is same for others
  //getProducts was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getProducts({ where: { id: prodId } })
    .then((products) => {
      const product = products[0];
      if (!product) {
        return res.redirect("/");
      }
      //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
      // we just complete the pathname to the templating engine here in the first argument below,
      //the second argument is the data we are passing to this view
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));

  //don't call next after you've sent a response becus this will cause an error
  //as sending a response means closing the process
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  //since we defined a relation in the app.js file where 'Product.belongsTo()User'.
  //a createProduct method was added by the Sequelize package, it is called createProduct
  //because your product model name is named Product, if your product mode name was called Myproduct
  //then this fn will be called createMyproduct.
  //this saves the data into the database(product-table), and adds the userId that created this prodcuct auto.
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //this method was given to use by this Sequlize package, where 'create' is appended to the begining of our model name to call it createProduct, this is same for others
  //createProduct was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      //console.log(result);
      res.redirect("admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  //see app.js, where I explained how i stored this method to the req.user obj for this specific user instance
  //this method was given to use by this Sequlize package, where get is appended to the begining of our model name to call it getProducts, this is same for others
   //user.getProducts() was possible because we defined the relation in app.js, where we said 'User.hasMany(Product);'
  //and this is like a blue print where 'user.getProducts()' matches this relation ->   'User.hasMany(Product);'  this is same for others
   //getProducts was availabe in the userObject because we stored all the function we need in the req.user obj in app.js file when we found a Dummy user with User.findById(1)
  req.user
    .getProducts()
    .then((products) => {
      //in app.js since we have already set a path to the folder(view) where the templating engine files is stored
      // we just complete the pathname to the templating engine here in the first argument below,
      //the second argument is the data we are passing to this view
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //findById is a method defined by the Sequelized package
  Product.findById(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
