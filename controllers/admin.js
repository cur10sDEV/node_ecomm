// db
const Product = require("../models/product");
const { deleteFile } = require("../utils/fileHandler");

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
      oldInput: { title: "", price: "", description: "" },
      validationErrors: [],
    });
  } else {
    res.redirect("/");
  }
};

// add product
const postAddProduct = async (req, res, next) => {
  try {
    const { title, price, description } = req.body;
    const image = req.file;
    if (!image) {
      return res.status(422).render("admin/addProduct.ejs", {
        pageTitle: "Add Product",
        path: "/admin/addProduct",
        errorMessage: "Selected file is not an image",
        oldInput: {
          title: title,
          price: price,
          description: description,
        },
        validationErrors: [],
      });
    }
    // ===> product validation <===
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("admin/addProduct.ejs", {
        pageTitle: "Add Product",
        path: "/admin/addProduct",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          title: title,
          price: price,
          description: description,
        },
        validationErrors: errors.array(),
      });
    }
    // ======> <======
    const product = new Product({
      title: title,
      imgUrl: image.path,
      description: description,
      price: price,
      userId: req.user,
    });
    await product.save();
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postEditProduct = async (req, res, next) => {
  try {
    const { edit } = req.query;
    const { id, title, price, description } = req.body;
    const image = req.file;
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
          price: price,
          description: description,
        },
        validationErrors: errors.array(),
      });
    }
    const product = await Product.findOne({ _id: id, userId: req.user._id });
    if (product) {
      product.title = title;
      if (image) {
        deleteFile(product.imgUrl);
        product.imgUrl = image.path;
      }
      product.price = price;
      product.description = description;
      await product.save();
    }
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
    error.httpStatusCode = 500;
    return next(error);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return next(new Error("Product not found!"));
    }
    deleteFile(product.imgUrl);
    await Product.deleteOne({ _id: productId, userId: req.user._id });
    res.redirect("/admin/products");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
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
