// this file has all the listing route functions
// this is done to structure our project in mvc format
// MVC : Models-Views-Controller
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");


// INDEX route:
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// NEW Route:
// write the new route above the show route or node will search new as id in DB
module.exports.createForm= async (req, res) => {
    res.render("listings/createNew.ejs");
};

// CREATE Route:
module.exports.createNew= async (req, res) => {

    let url= req.file.path;
    let filename= req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing added");
    res.redirect("/listings");
};

// SHOW route:
module.exports.show=async (req, res) => {
    let { id } = req.params;
    const showListings = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"} }).populate("owner");
    if(!showListings){
    req.flash("error"," Listing Not found");
     res.redirect("/listings");
    }
    res.render("listings/show.ejs", { showListings });
};

// Edit Route:
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const editListings = await Listing.findById(id);
    if(!editListings){
        req.flash("error"," Listing Not found");
         res.redirect("/listings");
        }
    res.render("listings/edit.ejs", { editListings });
};

// UPDATE Route: 
module.exports.update=async (req, res) => {
    let { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, req.body.listing);
   if(typeof req.file !== "undefined"){
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image={url,filename};
   await listing.save();
   }
   
    req.flash("success"," Listing Upadated");
    res.redirect(`/listings/${id}`);
};

// DELETE Route: 
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted");
    res.redirect("/listings");
};