const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// local imports
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
// models
const User = require("./models/user");

// db
const connectDB = require("./db/connectDB");
connectDB();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// mongodb-store-session
const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});
// Catch errors
store.on("error", function (error) {
  console.log(error);
});
//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    // cookie: {secure: true}
  })
);

// user auth
app.use(async (req, res, next) => {
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
  } catch (err) {
    console.error(err);
  } finally {
    next();
  }
});

// public assets
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// view engine ejs
app.set("view engine", "ejs");
app.set("views", "views");

// routes
app.use("/admin", adminRouter);
app.use(shopRouter);
app.use("/auth", authRouter);

// 404 page
app.use(require("./controllers/pageNotFound"));

app.listen(3000, () => {
  console.log(`Server started successfully`);
});
