// db
const Product = require("../models/product");

const { validationResult } = require("express-validator");

// add-product page
const getAddProduct = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  if (req.session.isLoggedIn) {
    res.render("admin/addProduct.ejs", {
      pageTitle: "Add Product",
      path: "/admin/addProduct",
      errorMessage: message,
      oldInput: { title: "", imgUrl: "", price: "", description: "" },
      validationErrors: [],
    });
  } else {
    res.redirect("/");
  }
};

// add product
const postAddProduct = async (req, res, next) => {
  try {
    const { title, imgUrl, price, description } = req.body;
    // ===> product validation <===
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/addProduct.ejs", {
        pageTitle: "Add Product",
        path: "/admin/addProduct",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          title: title,
          imgUrl: imgUrl,
          price: price,
          description: description,
        },
        validationErrors: errors.array(),
      });
    }
    // ======> <======
    const product = new Product({
      title: title,
      imgUrl: imgUrl,
      description: description,
      price: price,
      userId: req.user,
    });
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// edit product
const getEditProduct = async (req, res, next) => {
  try {
    let message = req.flash("error");
    message = message.length > 0 ? message[0] : null;
    const { productId } = req.params;
    const { edit } = req.query;
    if (!edit) {
      return res.redirect("/");
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect("/");
    }
    return res.render("admin/editProduct.ejs", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/products",
      editing: edit,
      errorMessage: message,
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

const postEditProduct = async (req, res, next) => {
  try {
    const { edit } = req.query;
    const { id, title, imgUrl, price, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/editProduct.ejs", {
        pageTitle: "Edit Product",
        path: "/admin/products",
        editing: edit,
        errorMessage: errors.array()[0].msg,
        product: {
          _id: id,
          title: title,
          imgUrl: imgUrl,
          price: price,
          description: description,
        },
        validationErrors: errors.array(),
      });
    }
    const product = await Product.findOne({ _id: id, userId: req.user._id });
    if (product) {
      product.title = title;
      product.imgUrl = imgUrl;
      product.price = price;
      product.description = description;
      await product.save();
    }
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// // get products list
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    // .select("title price imgUrl")
    // .populate("userId", "name");
    res.render("admin/productList.ejs", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await Product.deleteOne({ _id: productId, userId: req.user._id });
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    err.httpStatusCode = 500;
    return next(err);
  }
};

module.exports = {
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getAddProduct,
  getProducts,
  deleteProduct,
};
