const Product = require("../models/product");
const Cart = require("../models/cart");

const getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/productList.ejs", {
      products,
      pageTitle: "Products",
      path: "/products",
    });
  });
};

const getProductDetails = (req, res, next) => {
  const { id } = req.params;
  Product.findById(id, (product) => {
    res.render("shop/productDetails.ejs", {
      product,
      pageTitle: `${product.title}`,
      path: "/products",
    });
  });
};

const getHome = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index.ejs", {
      products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

// get cart page
const getCart = (req, res, next) => {
  Cart.getProducts((cart) => {
    Product.fetchAll((products) => {
      const cartItems = [];
      for (product of products) {
        const cartProduct = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProduct) {
          cartItems.push({ product, qty: cartProduct.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartItems,
      });
    });
  });
};

// add product to cart
const addToCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
    res.redirect("/cart");
  });
};

// delete cart item
const deleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect("/cart");
  });
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

module.exports = {
  getProducts,
  getHome,
  getCart,
  getCheckout,
  getOrders,
  getProductDetails,
  addToCart,
  deleteCartItem,
};
