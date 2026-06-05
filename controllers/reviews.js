const Review = require("../models/review");
const Listing = require("../models/listings"); 

module.exports.createReview = async(req,res) => {
    const { id } = req.params;
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.session.success = "Review Added Successfully";
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req,res) =>{
    const { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.session.success = "Review Deleted";
    res.redirect(`/listings/${id}`);
};

