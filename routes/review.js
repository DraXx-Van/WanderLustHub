const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings");
const {validateReview, isLoggedIn, isAutor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//REVIEW Route - Creating a new Review
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

router.delete("/:reviewId",
    isLoggedIn,
    isAutor,
    wrapAsync(reviewController.deleteReview));


module.exports = router;