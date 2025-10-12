const mongoose = require("mongoose");
const Listing=require("../models/listing");
const initData=require("./data");


main()
  .then(() => {
    console.log("Connection with database is successful.");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map(obj=> ({...obj , owner:"68e35e66cbe05e65c1ed4730"}));
    await Listing.insertMany(initData.data);
    console.log("Data is initlized");
}

initDB();