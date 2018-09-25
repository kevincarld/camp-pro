var express    = require("express");
var router     = express.Router({mergeParams:true});    //////////NOTE: to pass in the :id params
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var midWare    = require("../middleware/index");

router.get("/new",midWare.isLoggedIn, function(req,res) {           //show new comment form
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err || !foundCamp) {
            req.flash("errorMsg", "could not find campground from the database");
            res.redirect("back")
        } else {
            res.render("comments/new", {camp:foundCamp});
        }
    });
});

router.post("/",midWare.isLoggedIn ,function(req,res) {         //new comment logic
    Campground.findById(req.params.id, function(err,foundCamp) {
        if(err || !foundCamp){
            req.flash("errorMsg", "could not find campground from the database");
        } else {
            Comment.create(req.body.comment, function(err, commentCreated) {
                if(err) {
                    req.flash("errorMsg", "something went wrong!");
                    res.redirect("back")
                } else {
                    req.flash("successMsg", "new comment posted!");
                    commentCreated.author.id = req.user._id;
                    commentCreated.author.username= req.user.username;
                    commentCreated.save();
                    foundCamp.comments.push(commentCreated);
                    foundCamp.save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit",midWare.checkCommentAuth, function(req,res) {     //show comment edit form
    Comment.findById(req.params.comment_id, function(err,foundComment) {
        if(err || !foundComment) {
            req.flash("errorMsg", "could not find comment from the database");
            res.redirect("back");
        } else {
            res.render("comments/edit", {camp_id:req.params.id, comment:foundComment});
        }
    });
});

router.put("/:comment_id/edit",midWare.checkCommentAuth ,function(req,res) {     //edit logic
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err || !updatedComment) {
            req.flash("errorMsg", "something went wrong!");
            res.redirect("back")
        } else {
            req.flash("successMsg", "comment updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id/delete",midWare.checkCommentAuth ,function(req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            req.flash("errorMsg", "could not delete comment from the database");
            res.redirect("back");
        } else {
            req.flash("successMsg", "comment deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;