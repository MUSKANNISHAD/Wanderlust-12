import Listings from "../models/listings.js";

export const index = async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index", { allListings, category: undefined });
};

export const newListings = async (req, res) => {
    res.render("listings/new.ejs", { listing: {} });
};

export const editListings = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    if (!listing) {
        throw new expressError(404, "Listing Not Found");
    }
    let originalListing = listing.image.url;
    originalListing = originalListing.replace("/upload", "/upload/w_250,e_blur:300");
    res.render("listings/edit.ejs", { listing, originalListing });
};

export const updateListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
        await listing.save();
    }
    res.redirect("/listings");

    
};

export const showListings = async (req, res) => {
    const { id } = req.params;

    const listings = await Listings.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listings) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listings });
};

export const CreateListings = async (req, res, next) => {
    try {
        console.log("Uploaded file:", req.file);
        let url = req.file.path.replace('.jpg.jpg', '.jpg'); // clean URL
        let filename = req.file.filename;
        console.log("New listing category:", req.body.listing.category);


        const newlistings = new Listings(req.body.listing);
        newlistings.image = { url, filename };
        newlistings.owner = req.user._id;
        console.log("New listing object:", newlistings);
        console.log("New listing object:", newlistings.toObject());



        await newlistings.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

export const deleteListings = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listings.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
};
export default {
  index,
  newListings,
  editListings,
  updateListings,
  showListings,
  CreateListings,
  deleteListings
};

