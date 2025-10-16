const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  const newReveiw = new Review(req.body.review);
  newReveiw.author = req.user;
  listing.reviews.push(newReveiw);

  await newReveiw.save();
  await listing.save();
  console.log("New review has saved.");
  req.flash("success", "New review has saved.");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Reveiw has deleted Successfully.");
  res.redirect(`/listings/${id}`);
};
