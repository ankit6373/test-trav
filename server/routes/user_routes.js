var express      = require('express');
var {mongoose}   = require('../db/mongoose.js');
var {User}       = require('../models/users');
var {Trip}       = require('../models/trip');
var {BucketList} = require('../models/bucket');

const _ = require('lodash');

const  jwt      = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
var {ObjectID} = require('mongodb');
var user_route  = express.Router();
var app = express();
const Joi = require('joi');
const randomString = require('randomString');

const sharp   = require('sharp');
const multer  = require('multer');


const storage = multer.diskStorage({
	destination: function(req,file,cb){
		cb(null,'./uploads/');
	},
	filename: function(req,file,cb){
		cb(null,Date.now() + file.originalname);
	}
});



//const upload = multer({dest: 'uploads/'});

const upload = multer({storage: storage});
var bodyParser  = require('body-parser');
const nodemailer = require('nodemailer');
const user_auth = require('../middleware/user_auth');
const asyncMiddleware = require('../middleware/async');




// To create Bucket List

user_route.post('/create-bucket',user_auth,async(req,res) => {
    
	// I can use InsertmANY here also
	
	/*
        user.bucketList.insertMany([
		    { placeName: req.body.placeName1,
			reasonToGo: req.body.reasonToGo1,
			whyCantGo : req.body.whyCantGo1},
			{
				placeName: req.body.placeName2,
			    reasonToGo: req.body.reasonToGo2,
			    whyCantGo : req.body.whyCantGo2
			}
		]);
	*/
	
	const user = await User.findById(req.user._id);

	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	User.findById(req.user._id)
	    .then((user) => {
			user.bucketList.push(
			{placeName: req.body.placeName1,
			reasonToGo: req.body.reasonToGo1,
			whyCantGo : req.body.whyCantGo1
			},
			{placeName: req.body.placeName2,
			reasonToGo: req.body.reasonToGo2,
			whyCantGo : req.body.whyCantGo2
			},
			{placeName: req.body.placeName3,
			reasonToGo: req.body.reasonToGo3,
			whyCantGo : req.body.whyCantGo3
			},
			{placeName: req.body.placeName4,
			reasonToGo: req.body.reasonToGo4,
			whyCantGo : req.body.whyCantGo5
			},
			{placeName: req.body.placeName5,
			reasonToGo: req.body.reasonToGo5,
			whyCantGo : req.body.whyCantGo5
			}
			);
			user.save()
			    .then(() => {
					res.status(200).send("Bucket List Saved");
				}).catch((e) => {
					res.status(400).send(e);
				});
		//	return res.status(200).send(doc);
		}).catch(() => {
			return res.status(400).send('Could not Find User');
		});
		
	
});

// Get My All Bucket list // 

user_route.get('/get-my-bucket',user_auth,async(req,res) => {
		
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user.bucketList);
		
});


user_route.post('/ping-a-place',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
});



// Update User's Dp ///

user_route.post('/update_dp',user_auth,upload.single('dp'),async(req,res) => {
			
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	user.set({
			dp :  'http://localhost:3000/' + req.file.filename
	});
	
	user.save()
	    .then(() => {
			return res.status(200).send('Profile Picture Updated');
		}).catch((e) => {
			return res.status(400).send(e);
		});		
});

user_route.post('/update_cover',user_auth,upload.single('cover_pic'),async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User not Found');
	}
	
	//console.log(req.file.filename);
	
	user.set({
		cover_pic : 'http://localhost:3000/' + req.file.filename
	});

    user.save()
	    .then(() => {
			return res.status(200).send('Cover pic Updated');
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
});


// To Update User's Profile

user_route.patch('/update_me',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var body = _.pick(req.body,['name','city','country','about']);
	
	user.updateOne({$set: body})
	    .then((user) => {
			return res.status(200).send(user);
		}).catch((e) => {
			return res.status(400).send(400);
		});
	
});


// To Get Authenticated User Data

/******* Problem Route '/me'  **********/


user_route.get('/me',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id).select('-password,-isAdmin,emailSecretToken').populate('trips');
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user);
});

/********* Problem Route *******************/

user_route.get('/get-my-helpposts',user_auth,async(req,res) => {
	
    const user = await User.findById(req.user._id)
	        .populate({
				path   : 'helpPosts',
				model  : 'HelpPost',
				options : { sort : { 'createdAt' : -1 } }
			})
	          
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	return res.status(200).send(user.helpPosts);
	
});


user_route.get('/get-my-trips',user_auth,async(req,res) => {
		
	const user = await User.findById(req.user._id).populate('trips');
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user.trips);
		
});


user_route.post('/complete_a_place/:id',user_auth,(req,res) => {
	
	var bucektPlaceId = req.param('id');
	
	User.findById(req.user._id)
	    .then((user) => {
			user.bucketList.findById(bucektPlaceId)
			    .then((place) => {
					place.remove();
					user.compeletedPlaces.push(place);
					user.save();
				})
		}).catch(() => {
			return res.status(400).send('Could not Find any User')
		})
});

/****************** Following Routes ***********************/

// Route to send Follow Request to a user

user_route.get('/send-follow-request/:id',user_auth,async(req,res) => {
		
		
		const user = await User.findById(req.user._id);
	
	    if(!user){
		    return res.status(400).send('User Not Found');
	    }
		
		var requestUserId = req.params.id ;
		
		const requestedUser = await User.findById(requestUserId);
		
		
		if(!requestedUser){
			return res.status(400).send('Requested User not Found');
		}
		
		if(requestedUser.privacy === 'private'){
			
			requestedUser.Pending_Requests.push(user);
			
			requestedUser.save()
			    .then(() => {
					return res.status(200).send('Follow Request Send');
				}).catch(() => {
					return res.status(400).send(e);
				});			
			
		}else{
			
			if(requestedUser.Followers.indexOf(req.user._id) > -1){
				return res.status(400).send('Already Followed');
			}else if(user.Following.indexOf(requestUserId) > -1){
				return res.status(400).send('Already Followed');
			}else{
				
				requestedUser.Followers.push(user);
			    user.Following.push(requestedUser);
						
			    requestedUser.save()
			        .then(() => {
					    user.save()
					        .then(() => {
							    return res.status(200).send('Both Users Updated');
						    }).catch((e) => {
							return res.status(400).send(e);
						})
				    }).catch((e) => {
					    return res.status(400).send(e);
				    })		
				
			}				
			
		}		
		
});


// To Unfollow a User 

user_route.get('/unfollow/:userId',user_auth,async(req,res) => {
	
	const unfollowId = req.params.userId;
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	User.findByIdAndUpdate(req.user._id,
	                            { $pull : { 'Following' : unfollowId} }	 
								).then(() => {
									
									User.findByIdAndUpdate(unfollowId,
	                                    { $pull : {'Followers' : req.user._id } }
								    ).then(() => {
										return res.status(200).send('User Unfollowed');
									}).catch((e) => {
										return res.status(400).send(e);
									});
									
								}).catch((e) => {
									return res.status(400).send(e);
								});
	
	                       
	
	/*
	const deleteFollowing = await User.findByIdAndUpdate(req.user._id,
	                            { $pull : { 'Following' : unfollowId} }	                               }
								);
	                                   
	const deleteFollower  = await User.findByIdAndUpdate(unfollowId,
	                              { $pull : {'Followers' : req.user._id } }
								  );
								  
	*/							  
								 		
});
	
// To get Following Ids of the users whom the logged in User follows	
	
user_route.get('/get-loggedUser-followingIds',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	//const user = await User.find(url : userUrl);
	
	User.findById(req.user._id)
	    .then((user) => {
			return res.status(200).send(user.Following);
		}).catch((e) => {
			return res.status(400).send(e);
	});	
	
});
	
//  Route to accept the follow Request by Private User 

/*************** Following Routes ends *********************/

// Get LOgged inUser followers as an Object Array

user_route.get('/myFollowers',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
			
	User.findById(req.user._id).populate({
		path  : 'Followers',
		model : 'User',
		select : '_id url name dp'
	}).then((user) => {
			return res.status(200).send(user.Followers);
		}).catch((e) => {
			return res.status(400).send(e);
		});	
});


// Get LoggedIn User's Following Users as an Object Array

user_route.get('/myFollowing',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	User.findById(req.user._id).populate({
		path  : 'Following',
		model : 'User',
		select : '_id url name dp'
	}).then((user) => {
			return res.status(200).send(user.Following);
		}).catch((e) => {
			return res.status(400).send(e);
		});	
});


/********** Block a User *****************/

user_route.post('/block-a-user/:id',user_auth,async(req,res) => {

	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	var blockUserId = req.param('id');
		
	const blockUser = await User.findById(blockUserId);
	
	user.BlockList.push(blockUser);
	
	user.save()
	    .then(() => {
			return res.status(200).send('User Blocked');
		}).catch((e) => {
			return res.status(400).send(e);
		})
	
});

/********** Block a User ends ************/ 

/******************************************************************* Get Visiting Profile Data ********************************************************************************/

user_route.get('/get-visiting-userdata/:url',async(req,res) => {
	
	var userUrl = req.params.url;
	
	//const user = await User.find(url : userUrl);
	
	User.findOne({url: userUrl}).select('-password,-isAdmin,-emailSecretToken').populate('trips')
	    .then((user) => {
			return res.status(200).send(user);
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
	//return res.status(200).send(user);
	
});


user_route.get('/get-visiting-usertrips/:url',async(req,res) => {
	
	var userUrl = req.params.url;
	
	//const user = await User.find(url : userUrl);
	
	User.findOne({url: userUrl}).select('-password,-isAdmin,-emailSecretToken').populate({
		path  : 'trips',
		model : 'Trip',
		populate : {
			path  : 'Comments.commentedUser',
			model : 'User',
			select : '_id url name dp'
		}
	})
	    .then((user) => {
			return res.status(200).send(user.trips);
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
	//return res.status(200).send(user);
	
});

user_route.get('/get-visiting-userfollowers/:url',async(req,res) => {
	
	var userUrl = req.params.url;
		
	User.findOne({url: userUrl}).select('-password,-isAdmin,-emailSecretToken').populate({
		path  : 'Followers',
		model : 'User',
		select : '_id url name dp'
	})
	    .then((user) => {
			return res.status(200).send(user.Followers);
		}).catch((e) => {
			return res.status(400).send(e);
		});	
});

user_route.get('/get-visiting-userfollowing/:url',async(req,res) => {
	
	var userUrl = req.params.url;
		
	User.findOne({url: userUrl}).select('-password,-isAdmin,-emailSecretToken').populate({
		path  : 'Following',
		model : 'User',
		select : '_id url name dp'
	})
	    .then((user) => {
			return res.status(200).send(user.Following);
		}).catch((e) => {
			return res.status(400).send(e);
		});	
});

/*

user_route.get('/get-my-trips',user_auth,async(req,res) => {
		
	const user = await User.findById(req.user._id).populate('trips');
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	return res.status(200).send(user.trips);
		
});

*/

/******************************************************************* Notifications For User  ***********************************************************************************/

user_route.get('/get-my-notifications',user_auth,async(req,res) => {
	
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	User.findById(req.user._id).populate({
		path  : 'Notifications',
		model : 'Notification',
		populate : {
			path   : 'fromUser',
			model  : 'User',
			select : '_id url name dp'
		}
	})
	.limit(12)
	.then((notis) => {
		return res.status(200).send(notis.Notifications);
	}).catch((e) => {
		return res.status(400).send(e);
	});
	
});


/****************************************************************** Notification For User ***************************************************************************************/


/******************************************************** Get Visiting Profile Data Ends ****************************************************************************************/

user_route.get('/checking-baba',async(req,res) => {
	
	return res.status(200).send('Working');
	
});


module.exports = user_route;
