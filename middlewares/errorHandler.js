const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).render("500", {
    pageTitle: "Server Error",
    path: "*",
    isAuthenticated: res.locals.isAuthenticated,
    csrfToken: res.locals.csrfToken,
  });
};

module.exports = errorHandler;
