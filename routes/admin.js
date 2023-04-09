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

// <=================== Get Routes ===================>
router.get("/addProduct", productPage);

router.get("/products", getProducts);

router.get("/editProduct/:productId", getEditProduct);

// <================== Post Routes ===================>
router.post("/addProduct", addProduct);

router.post("/editProduct", postEditProduct);

router.post("/deleteProduct", deleteProduct);

module.exports = router;
