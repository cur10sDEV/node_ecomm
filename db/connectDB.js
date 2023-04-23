// getting-started.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/shop?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0"
    );
  } catch (error) {
    console.error(error);
  }
};
module.exports = connectDB;
