const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const passport = require("passport");
const { saveRedirect } = require("../middleware");
const userController = require("../controllers/user");

//Show signUp page
router.get("/signup",userController.showSignupPage);

//Sign Up  USER - Register a new User
router.post("/signup",userController.signup);

//show Login Page
router.get("/login",userController.showLoginPage);

// Logs in User
router.post(
    "/login",
    saveRedirect,
    passport.authenticate("local",{
        failureRedirect: "/login?error=true",
    }),
    userController.login
);

router.get("/logout",userController.logout);

module.exports = router;