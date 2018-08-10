var express       = require("express");
var mongoose      = require("mongoose");
var passport      = require("passport");
var localStrategy = require("passport-local");
var User          = require("./models/user");
var session       = require("express-session");
var bodyParser    = require("body-parser");
//routes
var authRoutes  = require("./routes/auth")
var indexRoutes = require("./routes/index")

var app = express();
app.use(express.static(__dirname + '/public'));
mongoose.connect("mongodb://admin:sss5533@127.0.0.1:27017/photoshare?authSource=admin", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: "this is a secret sentence",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


app.use(authRoutes);
app.use(indexRoutes);


app.listen(3000, function() {
	console.log("Server started");
});