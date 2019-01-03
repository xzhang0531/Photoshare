var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

router.get("/signup", function(req, res) {
	res.render("signup");
});

router.post("/signup", function(req, res) {
	User.register(new User({username: req.body.username}), req.body.password, function(err){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/" + req.body.username + "/profile");
		});
	})
})

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "login",
	}), function(req, res) {
});


router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});





router.get("/:username/profile", isLogged, function(req, res) {
	res.render("secret");
});


router.get("/:username/profile/profilephoto/upload", isLogged, function(req, res) {
	res.render("uploadProfilePhoto");
});

router.get("/:username/profile/profilephoto/crop", isLogged, function(req, res) {
	res.render("cropProfilePhoto");
});





module.exports = router;