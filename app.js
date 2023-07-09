const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

// local imports
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");

//errors
const { pageNotFound, serverError } = require("./controllers/errors");
// models
const User = require("./models/user");

// db
const connectDB = require("./db/connectDB");
const errorHandler = require("./middlewares/errorHandler");
connectDB();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// multer-configs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}`);
  },
});
// only allow images
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// multer
app.use(multer({ storage, fileFilter }).single("image"));

// public assets
app.use(express.static(path.join(__dirname, "public")));
// images
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);

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
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //24 hrs expiry
    },
    // cookie: { secure: true },
  })
);

// csrf token
app.use(csrf());

// flash message (like error)
app.use(flash());

// this middleware provides these locals(variable data) to every route
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// user auth
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
    }
    next();
  } catch (err) {
    next(new Error(err));
  }
});

// routes
app.use("/admin", adminRouter);
app.use(shopRouter);
app.use("/auth", authRouter);

// 500 page
app.get("/500", serverError);
// 404 page
app.use(pageNotFound);

// error handler middleware - will execute if any error occur or catch-block gets executed
app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server started successfully`);
});
