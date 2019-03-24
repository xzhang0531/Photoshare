var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var passport = require("passport");

function isLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.render("login", {message: "Please login to continue!"});
}



router.post("/:imgid/comment", isLogged, function(req, res) {
	var commentContent = req.body.commentContent;
	var imgid = req.params.imgid;
	var author = req.user.username;
	var newComment = {imageid:imgid,
					content: commentContent,
					author: author};
	Comment.create(newComment, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			Comment.find({imageid: req.params.imgid}, function(err, comments){
				if(err){
					console.log(err);
				}else{
					res.json({comments: comments});
				}
			});
		}
	});
});



router.get("/:imgid/comment", isLogged, function(req, res) {
	Comment.find({imageid: req.params.imgid}, function(err, comments){
		if(err){
			console.log(err);
		}else{
			res.json({comments: comments});
		}
	});
	
});

module.exports = router;