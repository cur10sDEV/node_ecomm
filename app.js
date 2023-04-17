const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// local imports
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

// db
const { connectDB } = require("./db/connectDB");
connectDB();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// public assets
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// view engine ejs
app.set("view engine", "ejs");
app.set("views", "views");

// admin routes
app.use("/admin", adminRouter);
app.use(shopRouter);

// 404 page
app.use(require("./controllers/pageNotFound"));

app.listen(3000, () => console.log(`Server started successfully`));
