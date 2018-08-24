var express = require("express");
var router = express.Router();
var Album = require("../models/album");



function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


router.get("/albums", isLogged, function (req, res) {
	Album.find({owner: req.user.username}, function(err, albums){
		if(err){
			console.log(err);
		}else{
			res.render("albums", {albums: albums});
		}
	});
});

router.post("/albums", isLogged, function(req, res) {
	var albumname = req.body.albumname;
	var albumtype = req.body.albumtype;
	var owner = req.user.username;
	var newAlbum = {albumname: albumname,
					albumtype: albumtype,
					owner: owner};
	Album.create(newAlbum, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("albums");
		}
	});
});


router.get("/albums/create", isLogged, function (req, res) {
	res.render("createAlbum");
});


module.exports = router;