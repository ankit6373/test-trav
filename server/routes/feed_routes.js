var express     = require('express');
var {mongoose}  = require('../db/mongoose.js');
var {User}      = require('../models/users');
var {Trip}      = require('../models/trip');
const _ = require('lodash');

const  jwt      = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
var {ObjectID} = require('mongodb');
var feed_route  = express.Router();
var app = express();
const Joi = require('joi');
const randomString = require('randomString');

var bodyParser  = require('body-parser');
const user_auth = require('../middleware/user_auth');
const asyncMiddleware = require('../middleware/async');


// To Post Comment

feed_route.post('/post-comment/:tripId/:userId',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var tripId = req.params.tripId;
	var userId = req.params.userId;
		
	var comment = req.body.comment;
		
	const trip     = await Trip.findById(tripId);
	const tripUser = await User.findById(userId);
		

	if(tripUser.privacy === 'private'){
		
		// Get All follower Id's of tripUser and store it in followersId
		
		var followersId = tripUser.Followers;
		
		if(followersId.indexOf(req.user._id) > -1 ){
			
			trip.Comments.push({
	            'commentedUser' : tripUser,
	            'comment'       : comment
	        });
		
	       trip.save()
	            .then((trip) => {
			        return res.status(200).send(trip._id);
		        }).catch((e) => {
			        return res.status(400).send(e);
		        });
			
		}else{
			return res.status(501).send('You are not Allowed to to this');
		}
		
	}else{
		
		trip.Comments.push({
	        'commentedUser' : tripUser,
	        'comment'       : comment
	    });
		
	    trip.save()
	        .then((trip) => {
			    return res.status(200).send(trip._id);
		   }).catch((e) => {
			    return res.status(400).send(e);
		   });
			
	}
		
});

// React On a Comment
feed_route.get('/react-on-comment/:tripId',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	const tripId = req.params.tripId;
	
	const trip = await Trip.findById(tripId);
		
	
	if(trip.Likers.indexOf(req.user._id) > - 1){
		
		const disliketrip = await Trip.findByIdAndUpdate(tripId,
					{ $pull : { 'Likers' : req.user._id }, $inc : { 'NoOfLikes' : -1 } }
	              );
		
		/*
		trip.set({
			$pull : { 'Likers' : user }, $inc : { 'NoOfLikes' : -1 }
		});
				
		const disliketrip = await trip.save();
		*/
		
		if(disliketrip){
			return res.status(200).send('Post Disliked');
		}
		
		
	}else{
		
		const liketrip = await Trip.findByIdAndUpdate(tripId,
					{ $push : { 'Likers' : user }, $inc : { 'NoOfLikes' : 1 } }
	               );
		
		/*
		trip.set({
			$push : { 'Likers' : user }, $inc : { 'NoOfLikes' : 1 }
		});
		
		const liketrip = await trip.save();
		*/
		
		if(liketrip){
			return res.status(200).send('Post Liked');
		}
		
		
	}
		
});


// To add place to Virtual Bucket List

feed_route.post('/add-to-bucket-list-virtual',user_auth,async(req,res) => {
	
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var postId = req.body.postId;
		
	user.virtualBucketList.push(postId);
	
	user.save().then(() => {
		return res.status(200).send('Add to Bucket List');
	}).catch((e) => {
		return res.status(400).send(e);
	});
	
	//user.BlockList.push(blockUser);
	
});


feed_route.get('/return-a-trip/:tripId',async(req,res) => {
		
	var tripId = req.params.tripId;
	
	Trip.findById(tripId).populate({
		path  : 'Comments.commentedUser',
		model : 'User',
		select : '_id url name dp',
		populate : {
			path   : 'replies.repliedUsers',
			model  : 'User',
			select : '_id url name dp'
		}
	}).then((trip) => {
		return res.status(200).send(trip.Comments);
	}).catch((e) => {
		return res.status(400).send(e);
	});
		
});



feed_route.get('/show-trips-onfeed',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id).populate({
		path  : 'Following',
		model : 'User',
		populate : {
			path    : 'trips',
			model   : 'Trip',
			options : { sort : { 'createdAt' : -1 } }
		}
	});
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	const following = await user.Following;
	
	const result = await _.flatMap(following,({name,_id,dp,url,country,trips}) => 
		    _.map(trips,trip => ({ name,_id,dp,url,country, ...trip}))
		 );
	
	return res.status(200).send(result);
	 		
});

// Suggested Users based on mutual followers

feed_route.get('/show-suggeseted-users-following',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	 
	const Followings = new Array();
	
	user.Following.forEach(following => {
		Followings.push(following);
	});
	
	User.find({
	    $and : [
		    { 'Following' : { '$in'  : Followings     } },
			{ '_id'       : { '$nin' : req.user._id   } },
			{ 'Following' : { '$nin' : user.BlockList } },
			{ '_id'       : { '$nin' : user.Following    } }
		]
	})
	.select('dp name city country about url Following Followers')
	.then((result) => {
		return res.status(200).send(result);
	}).catch((e) => {
		return res.status(200).send(e);
	})
		
});


// Suggested Users based on mutual Bucket List

feed_route.get('/show-suggeseted-users',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	const bucketNames = new Array();
	
	user.bucketList.forEach(bucket => {
		bucketNames.push(bucket.placeName);
	});
	
	User.find({
	    $and : [
		    { 'bucketList.placeName' : {'$in'   : bucketNames} },
			{ '_id'                  : { '$nin' : req.user._id } },
			{ '_id'                  : { '$nin' : user.BlockList } },
			{ '_id'                  : { '$nin' : user.Following } }			
		]
	})
	.select('dp name city country about url Following Followers')
	.then((result) => {
		return res.status(200).send(result);
	}).catch((e) => {
		return res.status(200).send(e);
	})
	
});


module.exports = feed_route;

