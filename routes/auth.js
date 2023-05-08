const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
} = require("../controllers/auth");

// auth middleware
const { isAuthForAuth } = require("../middlewares/auth");

router.get("/login", isAuthForAuth, getLogin);
router.post("/login", isAuthForAuth, postLogin);
router.post("/logout", postLogout);

router.get("/signup", isAuthForAuth, getSignUp);
router.post("/signup", isAuthForAuth, postSignUp);

module.exports = router;
