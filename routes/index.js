var express = require("express");
var router = express.Router();

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/");
}


router.get("/", function(req, res) {
	res.render("index");
});


router.get("/secret", isLogged, function(req, res){
	res.render("secret");
});

module.exports = router;