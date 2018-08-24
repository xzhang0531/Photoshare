var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
	photoname: String
});


var albumSchema = new mongoose.Schema({
	albumname: String,
	albumtype: String,
	owner: String,
	photos: [photoSchema]
});

var albumModel = mongoose.model("Album", albumSchema);

module.exports = albumModel;
