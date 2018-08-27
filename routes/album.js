var express = require("express");
var router = express.Router();
var Album = require("../models/album");
var mongoose = require("mongoose");
var Grid = require("gridfs-stream");

let gfs;
var conn = mongoose.connection;
conn.once('open', function() {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('images');
});


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

router.get("/albums/:id", isLogged, function (req, res) {
	albumId = req.params.id;
	Album.findById(albumId, function(err, album){
		if(err){
			return res.status(404).json({err: 'Not exists'});
		}else{
			res.render("album", {album: album})
		}
	});	
});



module.exports = router;