var express     = require('express');
var {mongoose}  = require('../db/mongoose.js');
var {User}      = require('../models/users');
var {Trip}      = require('../models/trip');
const _ = require('lodash');

const  jwt      = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
var {ObjectID} = require('mongodb');
var trip_route  = express.Router();
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

const upload = multer({storage: storage});
var bodyParser  = require('body-parser');
const user_auth = require('../middleware/user_auth');
const asyncMiddleware = require('../middleware/async');


// Route for User to Upload a Trip with a tagline,story and some pics

trip_route.post('/post-trip',user_auth,async(req,res) => {
				
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	//console.log(req.files);

	var trip = new Trip({
		tagLine : req.body.tagLine,
		tags    : req.body.tags,
		location: req.body.location,
		story   : req.body.story
	});
	
//	trip.save();
	
//	user.trip.push(trip);
	
	trip.save()
	    .then((trip) => {
			return res.status(200).send(trip._id);
		}).catch((e) => {
			return res.status(400).send(e);
		});

		
		
});


trip_route.post('/post-trip-images/:ObjectId',user_auth,upload.array('post_images',10),async(req,res) => {
				
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
	var filearray = new Array();
	for(let file of req.files){
		filearray.push('http://localhost:3000/' + file.filename);
	}
//	console.log(filearray);
	
	/*
	var uploadedImages = req.files;
	console.log(uploadedImages);
	console.log(req.files);
	console.log(req.files.length);
	*/
	
	
	var tripId = req.param('ObjectId');

	
	const trip = await Trip.findById(tripId);
	
	if(!trip){
		return res.status(400).send('No Trip was Found');
	}else{
		
		
        trip.set({
			    post_images : filearray 
		});
		
	//	trip.post_images : filearray;
		
		trip.save();
			
		user.trips.push(trip);
		user.save()
		    .then(() => {                   
				return res.status(200).send('Pictures Uploaded');
			}).catch((e) => {
				return res.status(400).send('Could Not Upload Photos');
			});
		
		
	}
	

});


// Route for User can delete a Particular Trip

trip_route.delete('/delete-trip/:id',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
});

// Route to So that People can like or comment or react on a trip of user,if public then anyone can do that if private then only user's followers

trip_route.post('/react-on-trip/:id',user_auth,async(req,res) => {
	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
	
});

// Route to show the post on news feed of following users 

module.exports = trip_route;
