const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const csrf = require("csurf");
const flash = require("connect-flash");

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

// public assets
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// view engine ejs
app.set("view engine", "ejs");
app.set("views", "views");

// mongodb-store-session
const store = new MongoDBStore({
  uri: process.env.DB_URI,
  collection: "sessions",
});
// Catch errors
store.on("error", function (error) {
  console.error(error);
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

// csrf token
app.use(csrf());

// flash message (like error)
app.use(flash());

// user auth
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.error(err.message);
  }
});

// this middleware provides these locals(variable data) to every route
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// routes
app.use("/admin", adminRouter);
app.use(shopRouter);
app.use("/auth", authRouter);

// 404 page
app.use(require("./controllers/pageNotFound"));

app.listen(3000, () => {
  console.log(`Server started successfully`);
});
