const pageNotFound = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "*",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports = pageNotFound;
