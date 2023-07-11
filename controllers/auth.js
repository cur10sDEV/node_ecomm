const User = require("../models/user");

// util functions - passwordHashingandChecking, sendingMailAfterSignupAndPasswordReset, generating random strings
const { genHashedPassword, checkPassword } = require("../utils/hash");
const { sendMail } = require("../utils/mailjet");
const randomString = require("../utils/randomString");

// validation
const { validationResult } = require("express-validator");

// login
const getLogin = (req, res, next) => {
  let message = req.flash("error");
  message = message.length > 0 ? message[0] : null;
  res.render("auth/login.ejs", {
    pageTitle: "Login",
    path: "/auth/login",
    errorMessage: message,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login.ejs", {
        pageTitle: "Login",
        path: "/auth/login",
        errorMessage: errors.array()[0].msg,
        oldInput: { email: email },
        validationErrors: errors.array(),
      });
    }
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// logout
const postLogout = (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) console.error(err);
      res.redirect("/auth/login");
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// signup
const getSignUp = (req, res, next) => {
  try {
    let message = req.flash("error");
    message = message.length > 0 ? message[0] : null;
    res.render("auth/signup.ejs", {
      pageTitle: "SignUp",
      path: "/auth/signup",
      errorMessage: message,
      oldInput: { username: "", email: "" },
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postSignUp = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/signup.ejs", {
        pageTitle: "SignUp",
        path: "/auth/signup",
        errorMessage: errors.array()[0].msg,
        oldInput: { username: username, email: email },
        validationErrors: errors.array(),
      });
    }

    if (password !== confirmPassword) {
      req.flash("error", "Password and Confirm Password do not match!");
      return res.redirect("/auth/signup");
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash("error", "Email already registered!");
      return res.redirect("/auth/signup");
    }
    const hashedPassword = await genHashedPassword(password);
    const user = await new User({
      username: username,
      email: email,
      password: hashedPassword,
      verified: false,
      cart: { items: [] },
    });
    await user.save();
    const token = await randomString(32);
    res.redirect("/auth/login");
    await sendMail(email, username, "accountVerification", { token });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// reset password
const getResetPassword = (req, res, next) => {
  try {
    let message = req.flash("error");
    message = message.length > 0 ? message[0] : null;
    res.render("auth/reset.ejs", {
      pageTitle: "Reset Password",
      path: "/auth/resetPassword",
      errorMessage: message,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await randomString(32);
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "Email not found!");
      return res.redirect("/auth/resetPassword");
    }
    if (user.resetTokenExpiration >= Date.now()) {
      req.flash(
        "error",
        "Already requested for password reset, Please try again after 1 hour."
      );
      return res.redirect("/auth/resetPassword");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1hr
    await user.save();
    req.flash("error", "An Email has been sent, check your inbox.");
    res.redirect("/auth/resetPassword");
    await sendMail(email, user.username, "passwordReset", { token });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const getNewPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (user) {
      let message = req.flash("error");
      message = message.length > 0 ? message[0] : null;
      res.render("auth/newPassword.ejs", {
        pageTitle: "Reset Password",
        path: "/auth/resetPassword",
        errorMessage: message,
        userId: user._id.toString(),
        resetToken: token,
      });
    } else {
      res.redirect("/auth/resetPassword");
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

const postNewPassword = async (req, res, next) => {
  try {
    const { userId, resetToken, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      req.flash("error", "New Password and Confirm New Password did not match");
    }
    if (userId && resetToken) {
      const user = await User.findOne({
        _id: userId,
        resetToken: resetToken,
        resetTokenExpiration: { $gt: Date.now() },
      });
      const hashedPassword = await genHashedPassword(newPassword);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
      res.redirect("/auth/login");
      await sendMail(user.email, user.username, "passwordResetSuccessfull", {});
    } else {
      res.redirect("/auth/resetPassword");
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getResetPassword,
  postResetPassword,
  getNewPassword,
  postNewPassword,
};
