const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const localStrategy = require("passport-local");
const {saveRedirectUrl}=require("../middleware");
const userControllers = require("../controllers/user");

router.route("/signup")
.get( userControllers.renderSignupForm)
.post(
  wrapasync(userControllers.signup)
);

router.route("/login")
.get( userControllers.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.Login
);

router.get("/logout", userControllers.Logout);

module.exports = router;
