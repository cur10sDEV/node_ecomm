const errorHandler = (error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "*",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports = errorHandler;
