const express = require("express");
const app = express();
const path = require("path");

// local imports
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// public assets
app.use(express.static(path.join(__dirname, "public")));

// view engine ejs
app.set("view engine", "ejs");
app.set("views", "views");

// admin routes
app.use("/admin", adminRouter);
app.use(shopRouter);

// 404 page
app.use(require("./controllers/pageNotFound"));

app.listen(3000, () => console.log(`Server started successfully`));
