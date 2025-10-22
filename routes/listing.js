const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingControllers = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingControllers.Index))
  .post(
    isLoggedIn,
    upload.fields([{ name: "listing[image][url]", maxCount: 1 }]),
    validateListing,
    wrapAsync(listingControllers.createListing)
  );

//New route

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/:id")
  //show route
  .get(wrapAsync(listingControllers.showListing))
  //updatelisting
  .put(
    validateListing,
    isLoggedIn,
    upload.fields([{ name: "listing[image][url]", maxCount: 1 }]),
    isOwner,
    wrapAsync(listingControllers.updateListing)
  )
  //delete listing
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

//Edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);

module.exports = router;
