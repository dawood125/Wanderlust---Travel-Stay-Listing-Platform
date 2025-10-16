const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReveiwAuthor } = require("../middleware");
const reviewControllers = require("../controllers/reviews");

// Add reviews route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.createReview)
);

//Delete review route

router.delete(
  "/:reviewId",
  isReveiwAuthor,
  wrapAsync(reviewControllers.deleteReview)
);
module.exports = router;
