var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var midWare    = require("../middleware/index");
var defaultImg = "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350";

router.get("/", function(req,res) {         //show camps / index page
    Campground.find({}, function(err,allCamps) {
        if(err) {
            req.flash("errorMsg", "could not find campground from database");
            
        } else {
            res.render("campgrounds/index", {campgrounds:allCamps} );
        }
    });
});

router.post("/",midWare.isLoggedIn, function(req,res) {        //adding camp logic
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.desc;
        if(!image) {
            image = defaultImg;
        }
    var author = { id: req.user.id, username: req.user.username }
    var newCamp = {name: name, price:price , image:image, description: desc, author:author};
    Campground.create(newCamp, function(err, newCamp) {
        if(err){
            req.flash("errorMsg", "could not create new camp");
        } else {
            req.flash("successMsg", "new camp added!");
            res.redirect("/campgrounds");     
        }
    });
});


router.get("/new",midWare.isLoggedIn ,function(req,res) {         //new camp- - show form
    res.render("campgrounds/new");
});

router.get("/:id", function(req,res) {         //show specific camp
    var campId = req.params.id;
    Campground.findById(campId).populate("comments").exec(function(err, foundCamp) {
        if(err || !foundCamp) {
            req.flash("errorMsg", "could not find campground from database");
            res.redirect("back")
        } else {
            res.render("campgrounds/show", {camp: foundCamp});
        }
    });
});


router.get("/:id/edit",midWare.checkCampgroundAuth ,function(req,res) {         //show edit form
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err || !foundCamp) {
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", {camp:foundCamp});
    })
});

router.put("/:id",midWare.checkCampgroundAuth ,function(req,res) {          //edit logic
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
        if(err || !updatedCamp){
            req.flash("errorMsg", "could not update campground from database");
            res.redirect("/campgrounds/"+req.params.id);
        } else {
            req.flash("successMsg", "successfully updated camp!");
            res.redirect("/campgrounds/"+req.params.id);    
        }
    });
});

router.delete("/:id",midWare.checkCampgroundAuth ,function(req,res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("errorMsg", "could not delete campground from database");
            res.redirect("/campgrounds");
        } else {
            req.flash("successMsg", "campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;