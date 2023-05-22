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

// auth validator middlewares - validate/sanitize user input
const {
  checkEmail,
  checkPassword,
  // checkConfirmPassword,
  checkUsername,
} = require("../middlewares/validators/authValidator");

// auth middleware - route protection
const { isAuthForAuth } = require("../middlewares/auth");

router.get("/login", isAuthForAuth, getLogin);
router.post(
  "/login",
  isAuthForAuth,
  [checkEmail(), checkPassword()],
  postLogin
);
router.post("/logout", postLogout);

router.get("/signup", isAuthForAuth, getSignUp);
router.post(
  "/signup",
  isAuthForAuth,
  [checkUsername(), checkEmail(), checkPassword()],
  postSignUp
);

router.get("/resetPassword", isAuthForAuth, getResetPassword);
router.post("/resetPassword", isAuthForAuth, postResetPassword);

router.get("/resetPassword/:token", isAuthForAuth, getNewPassword);
router.post("/newPassword", isAuthForAuth, postNewPassword);

module.exports = router;
