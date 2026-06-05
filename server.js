if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
};

const express = require("express");
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
// const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDb connection
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("Db connected successfully");
})
.catch((err)=>{
    console.log(err);
});

const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// EJS Setup 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsmate);

//middleWares
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(
  '/flowbite',
  express.static(path.join(__dirname, 'node_modules/flowbite'))
);
//Session Middlewares 
app.use(session(sessionOptions));
// app.use(flash());

//Auth Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.session.success || "";
    res.locals.error = req.session.error || "";
    res.locals.currUser = req.user;
    // console.log(req.user);
    delete req.session.success;
    delete req.session.error;

    next();
});

//Express routers 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//root route
app.get("/",(req,res) => {
    res.send("This is root path");
});

//Wrong Route - Page not found Error
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
});

//Error handling middleware - custom error message showing
app.use((err,req,res,next) => {
    const { statusCode = 500 , message = "Some Error" } = err;
    // res.status(statusCode).render("listings/error.ejs");
    res.status(statusCode).render("listings/error.ejs",{ statusCode,message });
});

//Server setup on port 8080
app.listen(8080,()=>{
    console.log("Server is running");
});
