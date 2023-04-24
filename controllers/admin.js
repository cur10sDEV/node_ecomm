// db
const Product = require("../models/product");

// add-product page
const productPage = (req, res) => {
  res.render("admin/addProduct.ejs", {
    pageTitle: "Add Product",
    path: "/admin/addProduct",
    isAuthenticated: req.session.isLoggedIn,
  });
};

// add product
const addProduct = async (req, res) => {
  try {
    const { title, imgUrl, price, description } = req.body;
    const product = new Product({
      title: title,
      imgUrl: imgUrl,
      description: description,
      price: price,
      userId: req.user,
    });
    await product.save();
  } catch (err) {
    console.error(err);
  } finally {
    res.redirect("/admin/products");
  }
};

// edit product
const getEditProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { edit } = req.query;
    if (!edit) {
      return res.redirect("/");
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/editProduct.ejs", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/products",
      editing: edit,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
  }
};

const postEditProduct = async (req, res) => {
  try {
    const { id, title, imgUrl, price, description } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
      title,
      imgUrl,
      price,
      description,
    });
  } catch (err) {
    console.error(err);
  } finally {
    res.redirect("/admin/products");
  }
};

// // get products list
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    // .select("title price imgUrl")
    // .populate("userId", "name");
    res.render("admin/productList.ejs", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await Product.findByIdAndDelete(productId);
  } catch (err) {
    console.error(err);
  } finally {
    res.redirect("/admin/products");
  }
};

module.exports = {
  addProduct,
  getEditProduct,
  postEditProduct,
  productPage,
  getProducts,
  deleteProduct,
};
