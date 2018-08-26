var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
	imageid: String,
	imagename: String,
	description: String
});


var albumSchema = new mongoose.Schema({
	albumname: String,
	albumtype: String,
	owner: String,
	images: [imageSchema]
});

var albumModel = mongoose.model("Album", albumSchema);

module.exports = albumModel;
