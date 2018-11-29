var express     = require('express');
var {mongoose}  = require('../db/mongoose.js');
var {User}          = require('../models/users');
var {Notification}  = require('../models/notification');
var {HelpPost}      = require('../models/helppost');
var {PlacePoints}   = require('../models/placepoints');
const _ = require('lodash');

var help_route  = express.Router();
var bodyParser  = require('body-parser');
const user_auth = require('../middleware/user_auth');
const asyncMiddleware = require('../middleware/async');

// To Post help_route

help_route.post('/post-help',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var helppost = new HelpPost({
		owner    : user,
		ownerId  : req.user._id,
		location : req.body.location.toLowerCase(),
		city     : req.body.city.toLowerCase(),
		country  : req.body.country.toLowerCase(),
		tags     : req.body.tags,
		post     : req.body.content
	});
	
	helppost.save();
	
	user.helpPosts.push(helppost);
	
	user.save()
	    .then(() => {
			return res.status(200).send('Post Saved');
		}).catch((e) => {
			return res.status(400).send(e);
		})
	
})

// Send Notification to the user where country matched


// To make a comment on a help post


help_route.post('/comment-on-helppost/:postId',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var PostId = req.params.postId;
	
	const hpost = await HelpPost.findById(PostId);
	
	const toNotifyUser = await User.findById(hpost.ownerId);
	
	/*
	const hhpost = await HelpPost.findOneAndUpdate(
			{ '_id' : PostId},
			{ $push : { 'Comments.$.comment' : req.body.comment } ,$inc : { 'CommentCount' : 1 }  } 
	);
	
	if(hhpost){
		return res.status(200).send('Yes');
	}else{
		return res.status(200).send('Error');
	}
	*/
	//	{ $push : { 'helpedPostIds' : PostId } ,$inc : { 'helppoints' : 10 }  } 
	
	hpost.Comments.push({
		CommentedUser : user,
		comment       : req.body.comment
	});
	
	
	//hpost = { $inc  : { 'CommentCount' : 1 }};
	
	/*
	hpost.set({
		$inc  : { 
		   'CommentCount' : 1 
		}
	});
    */
	/*
	hpost.save()
	    .then((post) =>{
			return res.status(200).send(post);
		}).catch((e) => {
			return res.status(200).send(e);
		});
	*/
	
	/*
	const hpost = await HelpPost.findOneAndUpdate(
			{ '_id' : PostId , 'Comments._id' : CommentId },
			{ $set  :   {
				            'Comments.$.helped' : true 
			            }
			}
		);
		
		// if successfull updated send notificatio to the User of the Comment and update his model with points
		if(hpost){
			const helpfuluser = await User.findOneAndUpdate(
				{ '_id' : CommUserId },
				{ $push : { 'helpedPostIds' : PostId } ,$inc : { 'helppoints' : 10 }  } 
			);
			
	
		/*
	
	hpost.set({
		$push : {'CommentedUser' : user, 'comment' :  req.body.comment},
		$inc  : { 'CommentCount' : 1 }
	});
	

	/*
	const helpfuluser = await User.findOneAndUpdate(
				{ '_id' : CommUserId },
				{ $push : { 'helpedPostIds' : PostId } ,$inc : { 'helppoints' : 10 }  } 
			);
	*/
	
	
	//hpost = { $inc  : { 'CommentCount' : 1 }};

	
	
	hpost.save()
	    .then(async(post) => {
			
			//check if post.comment_notify is false or not.. ? Do we need it,let it check first
			    if(post.comment_notify === false){
					var noti = new Notification({
				        postId   : PostId,
				        type     : 'comment',
                        fromUser : user						
			        });
					
					const notii = await noti.save();
					
					if(noti){
						post.comment_notify = true;
						post.save();
					}
					
					toNotifyUser.Notifications.push(notii);
					toNotifyUser.save()
					    .then(() => {
							
							return res.status(200).send('Notification saved');
							// send realtime noti to hpost.ownerId
							// io.to(toNotifyUser.socketId).emit('newNotification',noti)
						}).catch((e) => {
							return res.status(400).send(e);
						})
					
				}else{
					Notification.findOne(
					    { postId : PostId , type : 'comment'}
					).then(async(notification) => {
						notification.fromUser.push(user);
					    notification.save()
						    .then(() => {
								return res.status(200).send('Notification Saved again by other user');
							}).catch((e) => {
								return res.status(400).send(e);
							})
					})
				}

		}).catch((e) => {
			return res.status(200).send(e);
		});
			
	
});

help_route.get('/getHelpPost/:postId',async(req,res) => {
	
	// /:PostId?pageNumber=2&pageSize=10
	
	//const pageSize = 3;
	const PostId  = req.params.postId;
	//const pageNumber = req.query.pageNumber;
	//console.log(PostId);
	/*
	HelpPost.findById(PostId)
	    .skip(skip)
	    .limit(6)
	    .then((post) => { 
			return res.status(200).send(post);
		}).catch((e) => {
			return res.status(400).send(e);
		});  
	*/
	
	HelpPost.findById(PostId)
	    .populate({
			    path    : 'owner',
				model   : 'User',
				select  : '_id url name dp',
			})
		.populate({
			path    : 'Comments.CommentedUser',
			model   : 'User',
			select  : '_id url name dp',
		})	
		.populate({
			    path    : 'Comments',
				options : { 
						limit : 3
				}
			})
	    .then((post) => {
			return res.status(200).send(post);
		}).catch((e) => {
			return res.status(400).send(e);
	    }); 
	//console.log(pageNumber);
	
});

help_route.get('/get-comments/:postId',async(req,res) => {
	
	/*
	skip  : (pageNumber - 1)*pageSize,
	limit : pageSize
    */

	var pageSize = 3;
	const PostId  = req.params.postId;
	var pageNumber = req.query.pageNumber;
	
    //Comments 
	
	HelpPost.findOne({'_id' : PostId},{'Comments': { $slice : [(pageNumber - 1)*pageSize,pageSize]}} )
		.populate({
			path    : 'Comments.CommentedUser',
			model   : 'User',
			select  : '_id url name dp',
		})	
	    .then((post) => {
			return res.status(200).send(post.Comments);
		}).catch((e) => {
			return res.status(400).send(e);
	    });
	
	/*
	HelpPost.findById(PostId)
	    .populate({
			    path    : 'Comments',
				options : { 
				        skip  : (pageNumber - 1)*pageSize,
						limit : pageSize
				}
		})
		.populate({
			path    : 'Comments.CommentedUser',
			model   : 'User',
			select  : '_id url name dp',
		})	
	    .then((post) => {
			return res.status(200).send(post.Comments);
		}).catch((e) => {
			return res.status(400).send(e);
	    });
	*/
	
});


help_route.get('/mark-a-commentHelpful/:postId/:CommentId/:CommUserId',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	const PostId     = req.params.postId;
	const CommentId  = req.params.CommentId;
	const CommUserId = req.params.CommUserId;
		
	
	const post = await HelpPost.findById(PostId);
	
	if(!post){
		return res.status(400).send('Post Not Found');
	}
		
	// Check if request made by the user is the same who created the post
	   
    const CommUser  = await User.findById(CommUserId);
  
	if(CommUser.helpedPostIds.indexOf(PostId) > -1){
		return res.status(400).send({msg: "You can only mark One comment of a User " })
	}
   	   
	if( req.user._id === post.ownerId ){
		
		// Now Find the Comment in Post an update it to helpful
		
		const hpost = await HelpPost.findOneAndUpdate(
			{ '_id' : PostId , 'Comments._id' : CommentId },
			{ $set  :   {
				            'Comments.$.helped' : true 
			            }
			}
		);
		
		// if successfull updated send notificatio to the User of the Comment and update his model with points
		if(hpost){
			const helpfuluser = await User.findOneAndUpdate(
				{ '_id' : CommUserId },
				{ $push : { 'helpedPostIds' : PostId } ,$inc : { 'helppoints' : 10 }  } 
			);
			
			//Now Update the PlacePoint Model
			
			// Check if these 3 conditions matches in PlacePoints Model
			const existPlacePoints = await PlacePoints.findOne({
				                                $and : [
												    {'user_id' : CommUserId},
													{'city' : post.city}, 
													{ 'country' : post.country }
												]
											 }) ;
			

				if(existPlacePoints){
					
					existPlacePoints.set({
						$inc : { 'points' : 10 }
					});
					
					const existPlace = await existPlacePoints.save();
					
					if(existsPlace){
						return res.status(200).send('Marked Helpful');
					}
					
				}else{
					var newplacePoint = new PlacePoints({
						user_id    : CommUserId,
						user       : CommUser,
						city       : post.city,
						country    : post.country,
						points     : 10
					});
					
					const newPlace = await newplacePoint.save();
					
					if(newPlace){
						return res.status(200).send('Marked Helpful');
					}
				}
						
		}
		
	}
	
    		
});


// Delete comment

help_route.post('/delete-my-comment/:PostId/:CommentId',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
});


/*

help_route.get('/get-my-helpposts',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id).populate;
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
});

*/

help_route.get('/get-posts-forAcountry/:country',async(req,res) => {
	
	const countryPost = req.params.country;
	
	HelpPost.find({ 
	    country : countryPost,
		createdAt : { $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000) }
		})
	    .populate({
			path   : 'owner',
			model  : 'User',
			select : '_id url name dp'
		})
		.sort({createdAt : -1 })
	    .then((posts) => {
			return res.status(200).send(posts);
		}).catch((e) => {
			return res.status(400).send(e);
		});		
});


help_route.get('/get-random-posts-for-country-todisplay/:country',async(req,res) => {
	
	const countryPost = req.params.country;
	
	HelpPost.find({country : countryPost})
	    .populate({
			path   : 'owner',
			model  : 'User',
			select : '_id url name dp'
		})
		.sort({CommentCount : 1 })
		.limit(10)
	    .then((posts) => {
			return res.status(200).send(posts);
		}).catch((e) => {
			return res.status(400).send(e);
		});		
});

// For display on User's Profile 

help_route.get('/get-most-reviewd-places-by-user/:userId',async(req,res) => {
	
	const userId = req.params.userId;
	
	PlacePoints.findbyId(userId)
	           .sort({ points: 1})
			   .limit(4)
			   .then((placepoints) => {
				   return res.status(200).send(placepoints.user);
			   }).catch((e) => {
				  return res.status(400).send(e); 
			   });
	
});

// For listing Users on a page with this data

help_route.get('/get-users-with-their-top-rated-places/:country',async(req,res) => {
	
	const country = req.params.country;
	
	User.find({'country' : country})
	           .sort({ points: 1 })
			   .select('_id dp url name city country helppoints online bucketList')
			   .limit(50)
			   .then((users) => {
				   return res.status(200).send(users)
			   }).catch((e) => {
				   return res.status(400).send(e);
			   });
	
	
});
				
//options : { sort : { 'createdAt' : -1 } }

module.exports = help_route;