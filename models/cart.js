const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err && data.length > 0) {
        cart = JSON.parse(data);
      }
      // find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        // update product quantity and total price of the cart
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1, price: price };
        cart.products = [...cart.products, updatedProduct];
      }

      // update cart products & total price
      cart.totalPrice = cart.totalPrice + Number(price); // because recieving price as string

      // write new data to file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      // if cart dosent exist
      if (err) {
        return;
      }
      const cart = JSON.parse(data);
      const updatedCart = { ...cart };

      // find the product
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }

      // remove the product from the cart with the provided id
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );

      // update cart total price
      updatedCart.totalPrice -= Number(productPrice) * Number(product.qty);

      // write new data to file
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getProducts(cb) {
    fs.readFile(p, (err, data) => {
      // if cart dosent exist
      if (err) {
        cb(null);
      }
      const cart = JSON.parse(data);
      cb(cart);
    });
  }
};
