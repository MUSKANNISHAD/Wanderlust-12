import Reviews from "../models/review.js";
import Listings from "../models/listings.js";

export const postReviews = async (req, res) => {
    const listing = await Listings.findById(req.params.id);
    
    if (!listing) {
        throw new expressError(404, "Listing not found");
    }

    const newReview = new Reviews(req.body.review);
    newReview.author = req.user._id;
    console.log("new Review", newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new Review saved", newReview);
    res.redirect(`/listings/${listing._id}`);
};

export const deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};
 export default {postReviews,deleteReviews};