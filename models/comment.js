var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	imageid: String,
	author: String,
	content: String
});

var commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
