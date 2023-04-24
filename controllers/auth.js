const User = require("../models/user");

const getLogin = (req, res, next) => {
  const { isLoggedIn } = req.session;
  res.render("auth/login.ejs", {
    pageTitle: "Login",
    path: "/auth/login",
    isAuthenticated: isLoggedIn,
  });
};

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findById("643e4a24de3376787a0dbbc1");
    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err) => {
      if (err) console.error(err);
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
  }
};

const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.redirect("/auth/login");
  });
};

module.exports = { getLogin, postLogin, postLogout };
