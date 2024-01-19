

if (process.env.NODE_ENV != "production") {
 require("dotenv").config();
  // this means we don't have to upload this file in production enviornment
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");//for express sessions, But it only for local projects and not production
const MongoStore= require("connect-mongo");//this is used for production enviornment
const flash = require("connect-flash");

// Search for passport ;
// passport-local-mongoose, it is a tool which already set iin builts code for user login 
// it's usefull for login and password and has inbuilt hash functions and salts
// there many more options and functionallty , EXPLORE PASSPORT 
const passport = require("passport");
const localStratergy = require("passport-local");
const User= require("./models/user.js");

// importing the mongodb atlas url
const dbURL= process.env.ATLASDB_URL; 

const store= MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24*60*60,//seesion time in sessions
});

store.on("error", ()=>{
  console.log("Error in MONGO SESSION STORE", err);
})

const sessionOptions= { 
store,
  secret:process.env.SECRET,
resave: false, 
saveUninitialized: true,
cookie:{
  expires: Date.now() +7*24*60*60*1000,//here we have set expiry time in milliseconds
  maxAge: 7*24*60*60*1000,//
  httpOnly: true,
}, };



// all the listings route are stored in this file
const listings= require("./routes/listing.js");

// all the listings route are stored in this file
const reviews= require("./routes/review.js");

// all the listings route are stored in this file
const users= require("./routes/user.js");

// const {reviewSchema}=require("./joi.js");
const ejsMate = require('ejs-mate');
const user = require("./models/user.js");
app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));



main()
  .then(() => {
    console.log("connection successful")
  })
  .catch((err) => console.log(err));

// used to form a connection
async function main() { 
  await mongoose.connect(dbURL);

}

app.get("/", (req, res) => {
  res.send("Request Send");
});


app.use(session(sessionOptions));
app.use(flash());

// passort middleware
// this will intialize our password for every request
app.use(passport.initialize());
app.use(passport.session());
// we have to use this every time before using passort
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/demouser",async (req,res)=>{
//   let fakeUser= new User({
//     email:"student@gmail.com",
//     username: "delta-student",
//   });
//   let demo= await User.register(fakeUser,"helloWorld");
//   // helloWorld is the password  , and register is method defined in document of passort-local-mongoose
// // Explore the document
// res.send(demo);
// });




// middleware to flash messages
app.use((req,res,next)=> {
res.locals.success= req.flash("success");
res.locals.error= req.flash("error");
    // req.user will give us the info of user
res.locals.currentUser=req.user;
next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);



// if the user sends a request to route which doesn't exist
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  //  res.status(status).send(message);
  res.status(status).render("errors.ejs", { message });
})

app.listen("8080", (req, res) => {
  console.log("listening on port: 8080");
});
