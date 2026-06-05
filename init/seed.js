const mongoose = require("mongoose");
const Listing = require("../models/listings");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const {data} = require("./data");

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("Db connected successfully");
})
.catch((err)=>{
    console.log(err);
});


Listing.insertMany(data);