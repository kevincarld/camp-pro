var express= require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req,res) {        //cover page/landing
    res.render("landing");
});


router.get("/register", function(req,res) {        //show register form
    res.render("register");
});

router.post("/register", function(req,res) {       //register logic
    var newUser = new User({username:req.body.username});
    User.register(new User(newUser), req.body.password ,function(err,user) {
        if(err){
            req.flash("errorMsg", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("successMsg", "Successfully registered! Welcome " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login/xpass", function(req,res) {
    res.render("login", {errorMsg:"Invalid username/password, please try again"});
});

router.get("/login", function(req,res) {        //show login form
    res.render("login");
})

router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login/xpass",
    }),  //middleware for auth
    function(req,res) {       //login logic
    
        
    });

router.get("/logout", function(req,res) {
    req.logout();                       //logout() from passport func
    req.flash("successMsg", "You have logged out");
    res.redirect("/login");
})


module.exports = router;