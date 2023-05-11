// db
const Product = require("../models/product");

// add-product page
const productPage = (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("admin/addProduct.ejs", {
      pageTitle: "Add Product",
      path: "/admin/addProduct",
    });
  } else {
    res.redirect("/");
  }
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
    });
  } catch (err) {
    console.error(err);
  }
};

const postEditProduct = async (req, res) => {
  try {
    const { id, title, imgUrl, price, description } = req.body;
    const product = await Product.findOne({ _id: id, userId: req.user._id });
    if (product) {
      product.title = title;
      product.imgUrl = imgUrl;
      product.price = price;
      product.description = description;
      await product.save();
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.redirect("/admin/products");
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
    console.error(err);
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;
    await Product.deleteOne({ _id: productId, userId: req.user._id });
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
