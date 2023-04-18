const { getDB } = require("../db/connectDB");
const mongodb = require("mongodb");

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart ? cart : { items: [] };
    this._id = id;
  }

  save() {
    const db = getDB();
    db.collection("users").insertOne(this);
  }

  static findById(id) {
    const db = getDB();
    return db.collection("users").findOne({ _id: ObjectId(id) });
  }

  // cart
  addToCart(product) {
    // if the product exists in the cart increase the quantity
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].qty + 1;
      updatedCartItems[cartProductIndex].qty = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        qty: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDB();
    // an array of ids of items in cart
    const productIds = this.cart.items.map((i) => i.productId);
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((items) => {
        return items.map((item) => {
          return {
            ...item,
            qty: this.cart.items.find(
              (p) => p.productId.toString() === item._id.toString()
            ).qty,
          };
        });
      })
      .catch((err) => console.error(err));
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (p) => p.productId.toString() !== productId.toString()
    );
    const db = getDB();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  // orders
  addOrder() {
    const db = getDB();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.username,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDB();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }
}

module.exports = User;
