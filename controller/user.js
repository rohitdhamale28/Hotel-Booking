// this file has all the listing route functions
// this is done to structure our project in mvc format
// MVC : Models-Views-Controller
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");


module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);

      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", " Welcome to Wanderlust");
        res.redirect("/listings");
      });
  
    }
    catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  };

module.exports.login=async (req, res) => {

    let { username } = req.body;

    const registerUser = await User.findOne({ username: username });
    req.flash("success", " Welcome to Wanderlust");
    if(res.locals.redirectUrl){
      res.redirect(res.locals.redirectUrl);
    }else{
     res.redirect("/listings");
    }

   
};

module.exports.logout= (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are Logged out");
      res.redirect("/listings");
    })
  }
