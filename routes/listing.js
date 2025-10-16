const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingControllers = require("../controllers/listing");

//Index Route
router.get("/", wrapAsync(listingControllers.Index));

//New route

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

//show route

router.get("/:id", wrapAsync(listingControllers.showListing));
//create route
router.post("/", validateListing, wrapAsync(listingControllers.createListing));

//Edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);
//update route
router.put(
  "/:id",
  validateListing,
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.updateListing)
);

//Delete route

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.deleteListing)
);

module.exports = router;
