const User = require("../models/user");

const { genHashedPassword, checkPassword } = require("../utils/hash");

// login
const getLogin = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/login.ejs", {
    pageTitle: "Login",
    path: "/auth/login",
    errorMessage: message,
  });
};

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const match = user && (await checkPassword(password, user.password));
    if (!user || !match) {
      req.flash("error", "Invalid email or password!");
      return res.redirect("/auth/login");
    }
    if (user && match) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      return req.session.save((err) => {
        if (err) console.error(err);
        res.redirect("/");
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// logout
const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/auth/login");
  });
};

// signup
const getSignUp = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/signup.ejs", {
    pageTitle: "SignUp",
    path: "/auth/signup",
    errorMessage: message,
  });
};

const postSignUp = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash("error", "Email already registered!");
      return res.redirect("/auth/signup");
    }
    if (password !== confirmPassword) {
      req.flash("error", "Password and Confirm Password do not match!");
      return res.redirect("/auth/signup");
    }
    const hashedPassword = await genHashedPassword(password);
    const user = await new User({
      username: username,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getLogin, postLogin, postLogout, getSignUp, postSignUp };
