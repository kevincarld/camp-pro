var mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");
  
  
mongoose.connect("mongodb://localhost:27017/campdb", { useNewUrlParser: true });

var data = [
        {name: "bobbin head", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350", 
        description:"sample desc 1"},
        {name: "blue mountains", image:"https://images.pexels.com/photos/116104/pexels-photo-116104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350", 
        description:"sample desc 2"},
        {name: "the cabin", image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=350", 
        description:"sample desc 3"}
    ]
var xComment = {text:"ito ay sample na comment", author:"keicee pogi"};

function seedDb() {
    Campground.remove({}, function(err) {
        if(err){
            console.log(err);
        } else {
            console.log("all camps removed");
            Comment.remove({},function(err) {
                if(err) {
                    console.log(err);
                } else {
                    data.forEach(function(data) {
                        Campground.create(data, function(err, campground) {
                            if(err) {
                                console.log(err);
                            } else {
                                Comment.create(xComment, function(err, comment) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        campground.comments.push(comment);
                                        campground.save();
                                        console.log("comments inserted inside campgrounds")
                                    }
                                });
                            }
                        });
                    })
                }
            });
        }
    });
}


module.exports = seedDb;