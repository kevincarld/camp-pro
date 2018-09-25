var Campground = require("../models/campground");
var Comment =require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundAuth = function(req,res,next){
    if(req.isAuthenticated()) {          //isAuth() is from passport func
        Campground.findById(req.params.id, function(err,foundCamp) {
            if(err || !foundCamp){
                req.flash("errorMsg", "could not find the campground from the database");
                res.redirect("back");
            } else {
                if(foundCamp.author.id.equals(req.user._id)) {      //*.author.id.equals() method used bcoz it's an object that needs to be compared to a string
                    next();
                } else {
                    req.flash("errorMsg", "Sorry, you are not authorized to do this.");
                    res.redirect("back")
                }
            }
        });
    } else {
        req.flash("errorMsg", "Sorry, you must sign-up/sign-in before you do that.");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentAuth = function(req,res,next){
    if(req.isAuthenticated()) {          //isAuth() is from passport func
        Comment.findById(req.params.comment_id, function(err,foundComment) {
            if(err || !foundComment){
                req.flash("errorMsg", "could not find the comment from the database");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {      //*.author.id.equals() method used bcoz it's an object that needs to be compared to a string
                    next();
                } else {
                    req.flash("errorMsg", "Sorry, you are not authorized to do this.");
                }
            }
        });
    } else {
        req.flash("errorMsg", "Sorry, you must sign-up/sign-in before you do that.");
        res.redirect("/login")
    }
}


middlewareObj.isLoggedIn = function(req,res,next) {     // custom middleware
    if(req.isAuthenticated()) {         //isAuth() is from passport func
        return next();
    } else {
        req.flash("errorMsg", "Sorry, you must sign-up/sign-in before you do that.");
        res.redirect("/login");   
    }
}


module.exports = middlewareObj;