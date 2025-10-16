const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const localStrategy = require("passport-local");
const {saveRedirectUrl}=require("../middleware");
const userControllers = require("../controllers/user");

router.get("/signup", userControllers.renderSignupForm);

router.post(
  "/signup",
  wrapasync(userControllers.signup)
);

router.get("/login", userControllers.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.Login
);

router.get("/logout", userControllers.Logout);

module.exports = router;
