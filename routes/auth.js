const express = require("express");
const router = express.Router();
const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");

// auth middleware
const { isAuthForAuth } = require("../middlewares/auth");

router.get("/login", isAuthForAuth, getLogin);
router.post("/login", isAuthForAuth, postLogin);
router.post("/logout", postLogout);

router.get("/signup", isAuthForAuth, getSignUp);
router.post("/signup", isAuthForAuth, postSignUp);

router.get("/resetPassword", isAuthForAuth, getResetPassword);
router.post("/resetPassword", isAuthForAuth, postResetPassword);

router.get("/resetPassword/:token", isAuthForAuth, getNewPassword);
router.post("/newPassword", isAuthForAuth, postNewPassword);

module.exports = router;
