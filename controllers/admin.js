// db
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
  const product = new Product(
    title,
    imgUrl,
    description,
    Number(price),
    null,
    req.user._id
  );
  product.save();
  res.redirect("/admin/products");
};

// edit product
const getEditProduct = (req, res) => {
  const { productId } = req.params;
  const { edit } = req.query;
  if (!edit) {
    return res.redirect("/");
  }
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/editProduct.ejs", {
        product,
        pageTitle: "Edit Product",
        path: "/admin/products",
        editing: edit,
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error("Can't edit this product");
    });
};

const postEditProduct = (req, res) => {
  const { id, title, imgUrl, price, description } = req.body;
  const updatedProduct = new Product(
    title,
    imgUrl,
    description,
    Number(price),
    id
  );
  updatedProduct
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};

// // get products list
const getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/productList.ejs", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.error(err);
      throw new Error("No products found!");
    });
};

// delete product
const deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.error(err));
};

module.exports = {
  addProduct,
  getEditProduct,
  postEditProduct,
  productPage,
  getProducts,
  deleteProduct,
};
