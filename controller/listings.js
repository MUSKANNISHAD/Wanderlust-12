import Listings from "../models/listings.js";
import expressError from "../utils/expressCode.js";

// Show all listings
export const index = async (req, res) => {
  const allListings = await Listings.find({});
  res.render("listings/index", { allListings, category: undefined });
};

// New listing form
export const newListings = (req, res) => {
  res.render("listings/new.ejs", { listing: {} });
};

// Edit form
export const editListings = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listings.findById(id);
  if (!listing) {
    throw new expressError(404, "Listing Not Found");
  }

  let originalListing = listing.image.url.replace(
    "/upload",
    "/upload/w_250,e_blur:300"
  );

  res.render("listings/edit.ejs", { listing, originalListing });
};

// Update listing
export const updateListings = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// Show one listing
export const showListings = async (req, res) => {
  const { id } = req.params;

  const listings = await Listings.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listings) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listings });
};

// Create new listing
export const CreateListings = async (req, res, next) => {
  try {
    console.log("Uploaded file:", req.file);

    const newlistings = new Listings(req.body.listing);

    if (req.file) {
      newlistings.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    newlistings.owner = req.user._id;

    await newlistings.save();
    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newlistings._id}`);
  } catch (err) {
    next(err);
  }
};

// Delete listing
export const deleteListings = async (req, res) => {
  let { id } = req.params;
  await Listings.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

export default {
  index,
  newListings,
  editListings,
  updateListings,
  showListings,
  CreateListings,
  deleteListings,
};
