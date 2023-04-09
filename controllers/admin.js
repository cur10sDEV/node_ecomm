const Product = require("../models/product");

// add-product page
const productPage = (req, res) => {
  res.render("admin/addProduct.ejs", {
    pageTitle: "Add Product",
    path: "/admin/addProduct",
  });
};

const addProduct = (req, res) => {
  const { title, imgUrl, price, description } = req.body;
  const product = new Product(null, title, imgUrl, description, price);
  product.save();
  res.redirect("/shop/productList.ejs");
};

// edit product
const getEditProduct = (req, res) => {
  const { productId } = req.params;
  const { edit } = req.query;
  if (!edit) {
    return res.redirect("/");
  }
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/editProduct.ejs", {
      product,
      pageTitle: "Edit Product",
      path: "/admin/products",
      editing: edit,
    });
  });
};

const postEditProduct = (req, res) => {
  const { id, title, imgUrl, price, description } = req.body;
  const updatedProduct = new Product(id, title, imgUrl, description, price);
  updatedProduct.save();
  res.redirect("/admin/products");
};

// get products list
const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/productList.ejs", {
      products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};

// delete product
const deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};

module.exports = {
  addProduct,
  getEditProduct,
  postEditProduct,
  productPage,
  getProducts,
  deleteProduct,
};
