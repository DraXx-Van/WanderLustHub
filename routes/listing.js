const express = require("express");
const router = express.Router();
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

//Index Route - View All listings
router.get("/", wrapAsync(listingController.index));

//New Lising - Page new route
router.get("/new", isLoggedIn, listingController.newListingForm);

//Edit Page
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListingForm)
);

//edit a listing - UPDATE Route
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.editListing)
);

//Delete a listing
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

//Show Route - view specific listing
router.get("/:id",wrapAsync(listingController.showListing));

//Add new Listing - create route
router.post("/",
    isLoggedIn,
    validateListing,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
);
module.exports = router;