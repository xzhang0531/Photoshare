var express = require("express");
var router = express.Router();

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.message = "please log in.";
	res.redirect("/");
}


router.get("/", function(req, res) {
	var message = "";
	if(req.session.message){
		message = req.session.message;
		req.session.message = null;
	};
	res.render("index", {message: message});
});


router.get("/secret", isLogged, function(req, res){
	res.render("secret");
});

module.exports = router;