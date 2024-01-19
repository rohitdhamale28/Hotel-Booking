// this file contains review routes which are copied from ro.js 
// this file is just created to sort the the code and make it clean
// the routes are again required in app.js and perform this same task 

// Review: All the Routes related to review are in this File

const express = require("express");
const router = express.Router({mergeParams : true});
// merge params is used because when we try to add new review or post 
// the listing _id is not passed to review.js and _id parametwer remains in the app.js file 


// const app= express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const methodOverride = require("method-override");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../joi.js");
// const {reviewSchema}=require("./joi.js");
const ejsMate = require('ejs-mate');
// these are not required here
// app.engine('ejs', ejsMate);
// app.use(methodOverride("_method"));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));

const {validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

//this file imports all the review route functions
const { addReview, deleteReview } = require("../controller/reviews.js");


// MiddleWare to validate review: (written in middkeware.js)
// const validatereview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//       // this is the error message with error details
//       let errMsg = error.details.map((el) => el.message).join(",");
//       throw new ExpressError(400, errMsg);
//     } else {
//       next();
//     }
//   };


  

// Review: 
// POST Route

router.post("/",isLoggedIn, validatereview, wrapAsync(addReview));
  
  
  //Review Delete Route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(deleteReview));

module.exports= router;

  
  