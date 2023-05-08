// db
const mongoose = require("mongoose");

// schema
const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: Object, required: true, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
