const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth/login");
  }
  next();
};

const isAuthForAuth = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/");
  }
  next();
};

module.exports = { isAuth, isAuthForAuth };
