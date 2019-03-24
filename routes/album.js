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
	res.render("login", {message: "Please login to continue!"});
}


router.get("/:username/albums", isLogged, function (req, res) {
	var destUsername = req.params.username;
	if(destUsername == req.user.username){
		Album.find({owner: req.user.username}, function(err, albums){
			if(err){
				console.log(err);
			}else{
				res.render("myAlbums", {albums: albums});
			}
		});
	}else{
		res.render("secret");
	}
	
});

router.post("/:username/albums", isLogged, function(req, res) {
	var destUsername = req.params.username;
	if(destUsername == req.user.username){
		var albumname = req.body.albumname;
		var albumtype = req.body.albumtype;
		var owner = req.user.username;
		var newAlbum = {albumname: albumname,
						albumtype: albumtype,
						viewcount: 0,
						owner: owner};
		Album.create(newAlbum, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else{
				res.redirect("/"+req.user.username+"/albums");
			}
		});
	}else{
		res.render("secret");
	}
	
});


router.get("/:username/albums/create", isLogged, function (req, res) {
	var destUsername = req.params.username;
	if(destUsername == req.user.username){
		res.render("createAlbum");
	}else{
		res.render("secret");
	}
});

router.get("/:username/albums/:id", isLogged, function (req, res) {
	var destUsername = req.params.username;
	var albumId = req.params.id;
	if(destUsername == req.user.username){
		var albumId = req.params.id;
		Album.findById(albumId, function(err, album){
			if(err){
				return res.status(404).json({err: 'Not exists'});
			}else{
				if(album.owner != destUsername){
					return res.status(404).json({err: 'Not exists'});
				}
				res.render("myAlbum", {album: album})
			}
		});	
	}else{
		var albumId = req.params.id;
		Album.findByIdAndUpdate(albumId, {$inc:{viewcount: 1}}, function(err, album){
			if(err){
				return res.status(404).json({err: 'Not exists'});
			}else{
				res.render("userAlbum", {album: album})
			}
		});	
	}
});



module.exports = router;