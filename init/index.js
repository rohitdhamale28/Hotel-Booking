const mongoose= require("mongoose");
const  initData= require("./data.js");
const Listing= require("../models/listing.js");

const dbURL= "mongodb+srv://rohitdhamale05:cM79cg.PxW9N7uz@cluster0.82ltj62.mongodb.net/?retryWrites=true&w=majority";


console.log(dbURL);
main()
  .then(()=>{
    console.log("connection successful")
  })
  .catch((err)=>console.log(err));

// used to form a connection
 async function main(){
await mongoose.connect(dbURL);
 }

 const initDB= async () => {
    await Listing.deleteMany({});
     initData.data= initData.data.map((obj)=> ({...obj, owner: '65a10de59f406151d2b192df'}));
    await Listing.insertMany(initData.data);
    console.log("data Initiallised");
 }

 initDB();

