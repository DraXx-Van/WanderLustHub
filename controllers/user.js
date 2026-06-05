const User = require("../models/user");

module.exports.showSignupPage = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res) =>{
    try{
        const { username,email,password } = req.body.User;
        const newUser = new User({username,email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err) => {
            if(err)
                return next(err);
            req.session.success = "Account Created Successfully";
            res.redirect("/listings");
        });
        
    } catch(e){
        req.session.error = e.message;
        res.redirect("/signup");
    }
    
};

module.exports.showLoginPage = (req,res) =>{
    if(req.query.error){
        res.locals.error = "Invalid Username or Password";
    }
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) => {
    req.session.success = "Welcome Back !"
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.originalUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err)
            next(err);
        req.session.success = "You are logged out now";
        res.redirect("/listings");
    });
};