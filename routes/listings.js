import express from "express";
const router=express.Router();
import Listings from "../models/listings.js";
import expressError from "../utils/expressCode.js";
import  Reviews from "../models/review.js";
import WrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn,isOwner } from "../middleware.js";
// const User =require("../models/user.js");
import User from "../models/user.js";
// const ListingsController=require("../controller/listings.js");
import ListingsController from "../controller/listings.js";
import multer from "multer";
import {storage} from "../cloudConfigure.js";

const upload = multer({ storage: storage, })


// Search route
router.get("/search", async (req, res) => {
  const query = req.query.q;
  console.log(query);

  const listings = await Listings.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } }
    ]
  });

  res.render("listings/index", { allListings: listings, query });
});


router.get("/category/:category", async (req, res) => {
    const { category } = req.params;
    const allListings = await Listings.find({ category });
    res.render("listings/index", { allListings, category });
});



router.route("/")
.get(WrapAsync(ListingsController.index))
.post(isLoggedIn,
 upload.single('listing[image]'),
WrapAsync(ListingsController.CreateListings))


router.get("/new", isLoggedIn, WrapAsync(ListingsController.newListings));

router.route("/:id")
.put( isLoggedIn, upload.single('listing[image]'),
 WrapAsync(ListingsController.updateListings))
.get( WrapAsync(ListingsController.showListings))
.delete( isLoggedIn,isOwner,WrapAsync(ListingsController.deleteListings));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(ListingsController.editListings));



export default router;
