const express = require("express");
const router = express.Router();
const {
  postAddProduct,
  getAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

// product validator middlewares - validate/sanitize user input
const {
  checkTitle,
  checkImgUrl,
  checkPrice,
  checkDescription,
} = require("../middlewares/validators/productValidator");

// auth middleware - route protection
const { isAuth } = require("../middlewares/auth");

// <=================== Get Routes ===================>
router.get("/addProduct", isAuth, getAddProduct);

router.get("/products", isAuth, getProducts);

router.get("/editProduct/:productId", isAuth, getEditProduct);

// <================== Post Routes ===================>
router.post(
  "/addProduct",
  [checkTitle(), checkImgUrl(), checkPrice(), checkDescription()],
  isAuth,
  postAddProduct
);

router.post(
  "/editProduct",
  [checkTitle(), checkImgUrl(), checkPrice(), checkDescription()],
  isAuth,
  postEditProduct
);

router.post("/deleteProduct", isAuth, deleteProduct);

module.exports = router;
