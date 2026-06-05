const Listing = require("../models/listings");

module.exports.index = async (req,res) => {
    const listings = await Listing.find();
    res.render("listings/index.ejs", { listings });
};

module.exports.newListingForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.editListingForm = async (req,res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.createListing = async (req,res) => {
    const listing = req.body.listing;
    listing.owner = req.user._id;
    await Listing.create(listing);
    req.session.success = "Listing Created Successfully";
    res.redirect("/listings");
};

module.exports.editListing = async (req,res) => { 
    const { id } = req.params;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id,{...listing});
    req.session.success = "Listing Updated Successfully";
    res.redirect(`/listings/${id}`);
    // await Listing.findByIdAndUpdate(id,{...req.body.listings});
};

module.exports.deleteListing = async (req,res)=>{
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.session.success = "Listing Deleted Successfully";
    res.redirect("/listings");
};

module.exports.showListing = async (req,res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path : "reviews",
            populate : {
            path: "author"
        }
    }).populate("owner");
    
    if(!listing){
        req.session.error = "Listing Doesn't Exist";
        return res.redirect("/listings");
    }
    res.render("listings/listing.ejs", { listing });
};