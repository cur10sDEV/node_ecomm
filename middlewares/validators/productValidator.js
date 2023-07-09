const { body } = require("express-validator");

const checkTitle = (req, res, next) => {
  return body(
    "title",
    "Product title should only contains letters or numbers and must be in the range of 5 to 55 characters"
  )
    .trim()
    .isString()
    .escape()
    .isLength({ min: 3, max: 55 });
};

const checkImgUrl = (req, res, next) => {
  return body("imgUrl", "Not a valid image url").isURL();
};

const checkPrice = (req, res, next) => {
  return body("price", "Price should be in decimal or float").isFloat({
    min: 0,
    max: 1000000,
  });
};

const checkDescription = (req, res, next) => {
  return body(
    "description",
    "Description must be in range 5 to 1024 characters"
  )
    .trim()
    .isString()
    .escape()
    .isLength({ min: 5, max: 512 });
};

module.exports = { checkTitle, checkImgUrl, checkPrice, checkDescription };
