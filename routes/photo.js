var express = require("express");
var router = express.Router();
var passport = require("passport");
var path = require("path");
var mongoose = require("mongoose");
var multer = require("multer");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var crypto = require("crypto");


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

router.get("/photo/upload", function (req, res) {
	res.render("upload");
});

router.post("/photo", upload.single("file"), function(req, res) {
	res.json({ file: req.file});
});


module.exports = router;