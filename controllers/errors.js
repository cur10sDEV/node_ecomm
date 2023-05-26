const pageNotFound = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "*",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const serverError = (req, res) => {
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "*",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports = { pageNotFound, serverError };
