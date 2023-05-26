const Order = require("../models/order");
const Product = require("../models/product");

// get all products - product list page
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/productList.ejs", {
      products,
      pageTitle: "Products",
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// Product details Page
const getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render("shop/productDetails.ejs", {
      product,
      pageTitle: `${product.title}`,
      path: "/products",
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// Index - Home Page
const getHome = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render("shop/index.ejs", {
      products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// get cart page
const getCart = async (req, res, next) => {
  try {
    const { cart } = await req.user.populate("cart.items.productId");
    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "/cart",
      products: cart.items,
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// add product to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    req.user.addToCart(product);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// delete cart item
const deleteCartItem = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await req.user.deleteCartItem(productId);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// Orders
const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      orders: orders,
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

const postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((item) => {
      return {
        product: { ...item.productId._doc },
        quantity: item.quantity,
      };
    });
    const order = new Order({
      user: {
        username: req.user.username,
        userId: req.user._id,
      },
      products: products,
    });
    await order.save();
    await req.user.clearCartItems();
    res.redirect("/orders");
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// Checkout
const getCheckout = (req, res, next) => {
  try {
    res.render("shop/checkout", {
      pageTitle: "Checkout",
      path: "/checkout",
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
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
