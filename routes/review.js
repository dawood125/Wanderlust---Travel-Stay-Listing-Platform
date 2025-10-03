const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Review = require("../models/review");
const Listing = require("../models/listing");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Add reviews route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReveiw = new Review(req.body.review);

    listing.reviews.push(newReveiw);

    await newReveiw.save();
    await listing.save();
    console.log("New review has saved.");
    req.flash("success","New review has saved.");
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review route

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Reveiw has deleted Successfully.");
    res.redirect(`/listings/${id}`);
  })
);
module.exports=router;
