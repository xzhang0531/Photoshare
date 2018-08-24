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

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

//initialize the gridfs stream
var conn = mongoose.connection;
conn.once('open', function() {
  var gfs = Grid(conn.db, mongoose.mongo)
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
	res.json({ image: req.file});
});


module.exports = router;