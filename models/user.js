var mongoose              = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	profilephotoid: String
});
userSchema.plugin(passportLocalMongoose);

var userModel = mongoose.model("user", userSchema);

module.exports = userModel;
