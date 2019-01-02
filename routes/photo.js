var express = require("express");
var router = express.Router();
var passport = require("passport");
var path = require("path");
var mongoose = require("mongoose");
var multer = require("multer");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var crypto = require("crypto");
var Album = require("../models/album");

eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


//initialize the gridfs stream
let gfs;
var conn = mongoose.connection;
conn.once('open', function() {
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('images');
});


//create storage engine
var storage = new GridFsStorage({
  url: 'mongodb://admin:sss5533@127.0.0.1:27017/photoshare?authSource=admin',
  connectionOpts: { useNewUrlParser: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


router.get("/photo", function (req, res) {
	res.render("photo");
});

router.get("/photo/upload", isLogged, function (req, res) {
	Album.find({owner: req.user.username}, function(err, albums){
		if(err){
			console.log(err);
		}else{
			res.render("upload", {albums: albums});
		}
	});
});

router.post("/photo", isLogged, upload.single("image"), function(req, res) {
	var albumid = req.body.albumid;
	
	var imageid = req.file.id;
	var imagename = req.body.imagename;
	var description = req.body.description;

	var newImage = {
		imageid: imageid,
		imagename: imagename,
		description: description
	}

	Album.findByIdAndUpdate(albumid, 
		{$push: {images: newImage}},
		{safe: true, upsert:true, new:true},
		function(err, album){
		if(err){
			console.log(err);
		}else{
			res.redirect("/" + req.user.username +"/albums");
		}
	});
});


router.get("/photo/:id", function(req, res) {
	gfs.findOne({_id: req.params.id}, function(err, file){
		if (!file || file.length === 0) {
			return res.status(404).json({err: 'Not exists'});
		}

		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			var readstream = gfs.createReadStream(file._id);
			readstream.pipe(res);
		} else {
			return res.status(404).json({err: 'Not an image'});
		}
	});
})



module.exports = router;