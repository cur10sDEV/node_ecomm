const { check, body } = require("express-validator");

const checkEmail = (req, res, next) => {
  return body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail();
};

const checkPassword = (req, res, next) => {
  return body(
    "password",
    "Password Should be 8 characters long and must contain text, numbers and special characters"
  )
    .trim()
    .escape()
    .isLength({ min: 8, max: 128 });
};

// const checkConfirmPassword = (req, res, next) => {
//   return body("confirmPassword").custom((value, { request }) => {
//     if (value !== request.body.password) {
//       throw new Error("Password and Confirm Password do not match!");
//     }
//     return true;
//   });
// };

const checkUsername = (req, res, next) => {
  return body(
    "username",
    "Invalid Username! can only contain letters and numbers"
  )
    .trim()
    .escape()
    .isLength({ min: 2, max: 16 })
    .isAlphanumeric();
};

module.exports = {
  checkEmail,
  checkPassword,
  // checkConfirmPassword,
  checkUsername,
};
