var express     = require('express');
var {mongoose} = require('../db/mongoose.js');
var {User}    = require('../models/users');
var bodyParser  = require('body-parser');
const  jwt      = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
var {ObjectID} = require('mongodb');
var app = express();
var admin_route = express.Router();
const randomString = require('randomString');

const admin_auth = require('../middleware/admin_auth');

admin_route.post('/admin_sign_up',async(req,res) => {
			
	
	const salt          = await bcrypt.genSalt(10);
	const hash_password = await bcrypt.hash(req.body.password,salt);
	
        user = new User({
        name     : req.body.name,
        email    : req.body.email,
        password : hash_password,
		isAdmin  : true
    })

    user.save().then(() => {
        const token = user.generateAuthToken();
		return res.header('auth',token).status(200).send({
			"message" : "New Admin is Created"
		});
    }).catch((e) => {
		res.status(500).json({
			error : e
		})
	})
		
});

admin_route.post('/admin_sign_in',async(req,res) => {
	let user =  await User.findOne({email: req.body.email});
	
	if(!user){
		return res.status(400).send('Invalid Email');
	}
	 	
	const validPassword =  await bcrypt.compare(req.body.password,user.password);

	if(!validPassword){
		return res.status(400).send('Invalid Password');
	}
	
    const token = user.generateAuthToken();

	res.send(token);
    
});

admin_route.get('/admin_private',admin_auth,(req,res) => {
	return res.status(200).send('You are Allowed Admin');
});


module.exports = admin_route;