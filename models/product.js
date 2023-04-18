// db
const mongodb = require("mongodb");
const { getDB } = require("../db/connectDB");

class Product {
  constructor(title, imgUrl, description, price, id, userId) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDB();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.error(err));
  }

  static findById(id) {
    const db = getDB();
    return db
      .collection("products")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((product) => {
        return product;
      })
      .catch((err) => console.error(err));
  }

  static deleteById(id) {
    const db = getDB();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
