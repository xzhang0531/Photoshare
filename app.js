var express       = require("express");
var mongoose      = require("mongoose");
var passport      = require("passport");
var localStrategy = require("passport-local");
var User          = require("./auth/user");
var session       = require("express-session");
var bodyParser    = require("body-parser");

var app = express();
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


app.get("/", function(req, res) {
	res.render("index");
});

//==============
//Authentication
//==============
function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	res.send("please login!");
}


app.get("/signup", function(req, res) {
	res.render("signup");
});

app.post("/signup", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("secret");
		});
	})
})

app.get("/login", function(req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
		successRedirect: "secret",
		failureRedirect: "login"
	}), function(req, res) {
})
//==============
//Temp
//==============


app.get("/secret", isLogged, function(req, res){
	res.send("This is a secret page!!!");
});



app.listen(3000, function() {
	console.log("Server started");
});