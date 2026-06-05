const Listing = require("./models/listings");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.originalUrl = req.originalUrl; 
        req.session.error = "User not Logged in";
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirect = (req,res,next) => {
    if(req.session.originalUrl){
        res.locals.redirectUrl = req.session.originalUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next) => {
    const { id } = req.params;
    const { owner } = await Listing.findById(id);
    if(!owner.equals(req.user._id)){
        req.session.error = "You Dont Have Access";
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req,res,next) => {
    const { error } = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
};


module.exports.isAutor = async (req,res,next) => {
    const { reviewId,id } = req.params;
    const { author } = await Review.findById(reviewId);
    if(!author.equals(req.user._id)){
        req.session.error = "You Dont Have Access";
        return res.redirect(`/listings/${id}`);
    }
    next();

};