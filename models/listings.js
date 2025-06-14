import mongoose from "mongoose";
import Reviews  from "./review.js";


const { Schema } = mongoose;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    filename: String,
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "Cities", "mountain", "Beaches", "Pools", "Lakes",
      "Farms", "camping", "Arctic", "Play", "boats", "Trending", "Castles"
    ]
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listings = mongoose.model("Listing", listingSchema);
export default Listings;