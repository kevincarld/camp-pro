/////////////////////////////////////////////////////////////////// setup
var express        = require("express"),
        app        = express(),
        bodyParser = require("body-parser"),
        mongoose   = require("mongoose"),
        Campground = require("./models/campground"), //model
        Comment    = require("./models/comment"),
        flash      = require("connect-flash"),
        passport   = require("passport"),
    LocalStrategy  = require("passport-local"),
        User       = require("./models/user"),
    methodOverride = require("method-override");
// var seedDb= require("./seeds");

app.use(flash()); //for flash msgs        
//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");
        
//setting up db        
mongoose.connect("mongodb://localhost:27017/campdb", { useNewUrlParser: true });
//configs
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//seedDb();

//=============================
//      passport config
//=====================
app.use(require("express-session")({
    secret: "cindy panget",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next) {        //***custom middleware lets ALL routes-views have the currentUser variable that holds data
    res.locals.currentUser = req.user;      //req.user is from passport
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.successMsg = req.flash("successMsg");
    next();
});

passport.use(new LocalStrategy(User.authenticate()));    //telling passport to use the user auth method coming from the user model we configured
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============================
//      routes config
//=====================
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started...");
})