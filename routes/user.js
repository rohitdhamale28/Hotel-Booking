const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

//this file imports all the route route functions
const { signup, login, logout } = require("../controller/user.js");


router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(signup));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});


// passort.authenticate is used to check the password
router.post("/login",saveRedirectUrl,
  passport.authenticate("local",
    { failureRedirect: `/login`, failureFlash: true }),
  wrapAsync(login));


router.get("/logout",logout);
module.exports = router;