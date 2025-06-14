import mongoose from "mongoose";
import { Listing } from "./listings.js";


await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); // replace with your DB

const newListing = new Listing({
  title: 'New Apartment in Tokyo',
  description: 'Explore the vibrant city of Tokyo from this modern and centrally located apartment.',
  image: {
    url: 'https://your-image-url.com',
    filename: 'listingimage',
  },
  price: 2000,
  location: 'Tokyo',
  country: 'Japan',
  category: 'Pools', 
  owner: '682c1372c3911456d26ce31c', 
});

await newListing.save();
console.log("Listing saved!");
mongoose.connection.close();
