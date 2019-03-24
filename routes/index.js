var express = require("express");
var Album = require("../models/album");
var router = express.Router();

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.render("login", {message: "Please login to continue!"});
}


router.get("/", function(req, res) {
	res.render("index");
});


router.get("/browse", function(req, res) {
	Album.find({albumtype: "Public"}, function(err, albums){
		if(err){
			console.log(err);
		}else{
			res.render("browse", {albums: albums});
		}
	});
});


router.get("/secret", isLogged, function(req, res){
	res.render("uploadProfilePhoto");
});

module.exports = router;