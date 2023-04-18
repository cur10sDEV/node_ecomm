const Product = require("../models/product");

// get all products - product list page
const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/productList.ejs", {
        products,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error("No Products Found!");
    });
};

// Product details Page
const getProductDetails = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => {
      res.render("shop/productDetails.ejs", {
        product,
        pageTitle: `${product.title}`,
        path: "/products",
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error("No product Found");
    });
};

// Index - Home Page
const getHome = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index.ejs", {
        products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error("No Products Found!");
    });
};

// get cart page
const getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((items) => {
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: items,
      });
    })
    .catch((err) => console.error(err));
};

// add product to cart
const addToCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId).then((product) => {
    return req.user
      .addToCart(product)
      .then((result) => {
        console.log(result);
        res.redirect("/cart");
      })
      .catch((err) => console.error(err));
  });
};

// delete cart item
const deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

// Orders
const getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.error(err));
};

const postOrder = (req, res, next) => {
  req.user.addOrder().then((result) => {
    console.log(result);
    res.redirect("orders");
  });
};

// Checkout
const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

module.exports = {
  getProducts,
  getHome,
  getCart,
  getCheckout,
  getOrders,
  getProductDetails,
  addToCart,
  deleteCartItem,
  postOrder,
};
