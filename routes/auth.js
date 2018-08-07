var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");



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
			req.session.message = "Thanks for join photoshare!";
			res.redirect("/");
		});
	})
})

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
		successRedirect: "secret",
		failureRedirect: "login",
	}), function(req, res) {
});


router.get("/logout", function(req, res) {
	req.logout();
	req.session.message = "You have successfully logout.";
	res.redirect("/");
});

module.exports = router;