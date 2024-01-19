// this file contains index , shhow and various which are copied from ro.js 
// this file is just created to sort the the code and make it clean
// the routes are again required in app.js and perform this same task 

// Listing: All the Routes related to listing are in this File

const express = require("express");
const router = express.Router({ mergeParams: true });
// merge params is used because when we try to add new review or post 
// the listing _id is not passed to review.js or to listing.js and _id parametwer remains in the app.js file 

// this is the middleware to check wether we are loged in or not


// const app= express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const methodOverride = require("method-override");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../joi.js");
// const {reviewSchema}=require("./joi.js");
const ejsMate = require('ejs-mate');

// this will import the middle ware to check wether we are logged in or not
const { validatelisting, isLoggedIn, isOwner } = require("../middleware.js");


//this file imports all the listings
const { index, createNew, createForm, show, deleteListing, update, edit } = require("../controller/listings.js");

// MULTER: is package to send file to backend and they will store it in uploads folder
//        we can't send save files in mongodb due to limitations and hence we use cloud services for that 
// our backend is not able to read to files as we have set
// app.use(express.urlencoded({ extended: true }));
//using this we can only read the urlencoded data  


const multer = require("multer");
const { storage } = require("../coludConfig.js")
const upload = multer({ storage });
// with this we can store our uploads in our device storage floder
// const upload= multer({dest:'uploads/'});

// these are not required here
// app.engine('ejs', ejsMate);
// app.use(methodOverride("_method"));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: true }));



//  Validation for Schema: Converting joi function into middleware(written in middkeware.js)
// const validatelisting = (req, res, next) => {
//     let { error } = listingSchema.validate(req.body);
//     if (error) {
//         // this is the error message with error details
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     } else {
//         next();
//     }
// };

// this file has routes functions for listing
const listingController = require("../controller/listings.js")



// Router.route : this we can make our code more compact by combining the routes which have same path
//                eg. index and create route

// Index and Create route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),//this will upload the image on cloud
    validatelisting,
    wrapAsync(listingController.createNew));

// testing file Upload
// .post(upload.single("listing[image]"), (req,res)=> {
//     res.send(req.file);
// });


// INDEX route:
// router.get("/", wrapAsync(listingController.index));

// NEW Route:
// write the new route above the show route or node will search new as id in DB
router.get("/new", isLoggedIn, wrapAsync(listingController.createForm));

// CREATE Route:
// router.post("/",isLoggedIn, validatelisting, wrapAsync(listingController.createNew));

// SHOW route:
router.get("/:id", wrapAsync(listingController.show));



// Edit Route:
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));


// UPDATE Route: 
router.put("/:id", isLoggedIn, isOwner, 
upload.single("listing[image]"),//this will upload the image on cloud
validatelisting, wrapAsync(listingController.update));


// DELETE Route: 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;