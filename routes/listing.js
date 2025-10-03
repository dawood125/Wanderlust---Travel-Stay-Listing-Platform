const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New route

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you are trying to access does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);
//create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing Created!");
    res.redirect("/listings");
  })
);

//Edit route

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you are trying to access does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);
//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing.");
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete route

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted Successfully.");
    res.redirect("/listings");
  })
);

module.exports = router;
