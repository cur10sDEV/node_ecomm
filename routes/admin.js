const express = require("express");
const router = express.Router();
const {
  addProduct,
  productPage,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

// auth middleware
const { isAuth } = require("../middlewares/auth");

// <=================== Get Routes ===================>
router.get("/addProduct", isAuth, productPage);

router.get("/products", isAuth, getProducts);

router.get("/editProduct/:productId", isAuth, getEditProduct);

// <================== Post Routes ===================>
router.post("/addProduct", isAuth, addProduct);

router.post("/editProduct", isAuth, postEditProduct);

router.post("/deleteProduct", isAuth, deleteProduct);

module.exports = router;
