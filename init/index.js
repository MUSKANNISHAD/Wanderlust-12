import mongoose from "mongoose";
import data from "./db.js";
import Listings from "../models/listings.js";

const MONGO_URL="mongodb://muskan:pass@ac-u3mgcej-shard-00-00.bgtw0ei.mongodb.net:27017,ac-u3mgcej-shard-00-01.bgtw0ei.mongodb.net:27017,ac-u3mgcej-shard-00-02.bgtw0ei.mongodb.net:27017/airbnb?ssl=true&replicaSet=atlas-h535k4-shard-0&authSource=admin&appName=Cluster0"


async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to DB");
  await initDB();   // run AFTER connection
}

main().catch((err) => console.log(err));

const initDB = async () => {
  await Listings.deleteMany({});

  const updatedData = data.map((obj) => ({
    ...obj,
    owner: "682c1372c3911456d26ce31c",
  }));

  await Listings.insertMany(updatedData);
  console.log("data was initialized");
};