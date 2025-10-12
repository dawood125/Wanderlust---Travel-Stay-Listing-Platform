const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReveiwAuthor } = require("../middleware");

// Add reviews route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    const newReveiw = new Review(req.body.review);
    newReveiw.author = req.user;
    listing.reviews.push(newReveiw);

    await newReveiw.save();
    await listing.save();
    console.log("New review has saved.");
    req.flash("success", "New review has saved.");
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review route

router.delete(
  "/:reviewId",
  isReveiwAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Reveiw has deleted Successfully.");
    res.redirect(`/listings/${id}`);
  })
);
module.exports = router;
