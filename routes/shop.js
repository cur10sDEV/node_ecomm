const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductDetails,
  getHome,
  getCart,
  getCheckout,
  getOrders,
  addToCart,
  deleteCartItem,
  postOrder,
} = require("../controllers/shop");

// Home Page
router.get("/", getHome);

// products page
router.get("/products", getProducts);

router.get("/products/:id", getProductDetails);

// Cart Page
router.get("/cart", getCart);

router.post("/cart", addToCart);

router.post("/deleteCartItem", deleteCartItem);

// Orders
router.get("/orders", getOrders);

router.post("/orders", postOrder);

// Checkout
router.get("/checkout", getCheckout);

module.exports = router;
