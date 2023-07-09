const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductDetails,
  getHome,
  getCart,
  getCheckout,
  getOrders,
  getOrderInvoice,
  addToCart,
  deleteCartItem,
  postOrder,
} = require("../controllers/shop");

// auth middleware
const { isAuth } = require("../middlewares/auth");

// Home Page
router.get("/", getHome);

// products page
router.get("/products", getProducts);

router.get("/products/:id", getProductDetails);

// Cart Page
router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, addToCart);

router.post("/deleteCartItem", isAuth, deleteCartItem);

// Orders
router.get("/orders", isAuth, getOrders);

router.post("/orders", isAuth, postOrder);

// Order Invoices
router.get("/orders/:orderId", isAuth, getOrderInvoice);

// Checkout
router.get("/checkout", isAuth, getCheckout);

module.exports = router;
