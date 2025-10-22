const Listing = require("../models/listing");

module.exports.Index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  console.log("FILES:", req.files);
  console.log("BODY:", req.body);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;


  if (req.files && req.files["listing[image][url]"]) {
    const fileData = req.files["listing[image][url]"][0];
    newListing.image = {
      url: fileData.path,       
      filename: fileData.filename 
    };
  }

  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect(`/listings/${newListing._id}`);
};



module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you are trying to access does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing.");
  }
  let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.files && req.files["listing[image][url]"]) {
    const fileData = req.files["listing[image][url]"][0];
    listing.image = {
      url: fileData.path,       
      filename: fileData.filename 
    };
    await listing.save();
  }


  req.flash("success", "listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted Successfully.");
  res.redirect("/listings");
};
