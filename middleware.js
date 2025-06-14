// middleware.js
import Listings from "./models/listings.js";
import Reviews from "./models/review.js";

export const isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in for further process");
        return res.redirect("/login");
    }
    next();
};

export const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Reviews.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to delete this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

export const isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listings.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        return res.redirect(`/listings/${id}`);
    }
    next();
};
