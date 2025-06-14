import express from "express";
const router = express.Router({ mergeParams: true }); 
import WrapAsync from "../utils/wrapAsync.js";
import expressError from "../utils/expressCode.js";
import Review from "../models/review.js";
import Listings from "../models/listings.js";
import { isLoggedIn,isOwner,isReviewAuthor } from "../middleware.js";
import reviewsController  from "../controller/reviews.js";

// POST review
router.post("/",
    isLoggedIn,
    WrapAsync(reviewsController.postReviews));

// DELETE review
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     WrapAsync(reviewsController.deleteReviews));

export default router;
