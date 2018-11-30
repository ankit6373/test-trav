var express     = require('express');
var {mongoose}  = require('../db/mongoose.js');
var {User}      = require('../models/users');
var { LiveActivity } = require('../models/liveactivity');
var bodyParser  = require('body-parser');
const  jwt      = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
var {ObjectID} = require('mongodb');
var auth_route  = express.Router();
//var app = express();
const Joi = require('joi');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const user_auth = require('../middleware/user_auth');
const asyncMiddleware = require('../middleware/async');

/*********** For Sockets *******/

/*** Sockets Import ***/
//const app2 = require('../server');
//const http = require('http');
//const socketIO = require('socket.io');
//var server = http.createServer(app);
//var io = require('../server');
//var io = socketIO(server);
//require(io);
//var io = app.get('io');
//let io = require('socket.io')(server);
//require('../server');
//var app = require('../server');
//var pagal  = app.pagal;
//var theServer = require('../server');
//var iovar     = theServer.getIO();
/*** Sockets Imports ends **/

/************ For Sockets *********/

var passport = require('passport');
//var social   = require('./passport');


  
    let transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 	25,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '70c7b3d3ecdeb5', 
            pass: '1512315b563171' 
        }
    });

	
/********** Socket Things  **********/

    //console.log('IO: ', io);
    //console.log('pagal: ', pagal);
	

io.on('connect',(socket) => {
	//console.log('New User Connected from Client');
	
	socket.on('disconnect',() => {
        //console.log('User Diconnected from Client');
        //console.log(socket.id);
		
		try{
			User.findOneAndUpdate(
		        { 'socketId' : socket.id },
			    { $set : { 
			        'online'   : false,
			        } 			
			    }
		    ).then(() => {
			    console.log('is Offline Now');
		    }).catch((e) => {
			    console.log(e);
		    });
		}catch(e){
			console.log(e);
		}
        		
	});
	
	
    socket.on('showOnline',(UserId) => {
		//console.log(UserId,'user is online');
		
			
		User.findOneAndUpdate(
		    { '_id' : UserId },
			{ $set : {
				        'online'   : true,
						'socketId' : socket.id
			         }
			}
		).then((user) => {
			console.log(user.name,' ', 'is Online')
		}).catch((e) => {
			console.log(e);
		});
		
		
	});
	

	auth_route.post('/sign_up',async(req,res) => {
		
		
	    var user =  await User.findOne({email: req.body.email});

	
	    if(user){
		    return res.status(400).send(user);
	    }
	
	    const salt          = await bcrypt.genSalt(10);
	    const hash_password = await bcrypt.hash(req.body.password,salt);
	    const emailToken = randomstring.generate({
		    length : 6,
		    charset: 'numeric'
	    });
	
	    const url = req.body.name + '.' + randomstring.generate(7);
	
        user = new User({
            name             : req.body.name,
            email            : req.body.email,
            password         : hash_password,
		    city             : req.body.city,
		    country          : req.body.country,
		    emailSecretToken : emailToken,
		    url              : url
		
        });
		
        user.save().then((user) => {
            const token = user.generateAuthToken();
		
		        var newactivity = new LiveActivity({
			        username  :  user.name,
			        userdp    :  user.dp,     
			        activity  :  'just joined Travithlog'
		        });
		
		        newactivity.save().then((newactivity) => {			
			        res.status(200).send(token);
			        io.emit('getLiveActivity',newactivity);
		       }).catch((e) => {
			        res.status(400).send(e);
		       });
		
		// Email Verification Code //
		
		/*
	        let EmailVerification = {
                from    : '"TravithLog" <travithlog@noreply.com>', 
                to      :  req.body.email,
                subject : 'Confirm Email', 
                text    : 'Verify Email', 
                html    : 
			    '<div> <div>   <h5> Thank you for joining with TravithLog. </h5> </div> <div>  <h5> To be able to sign in to your account,Please enter this email verification ode to continue using TravithLog </h5>  <span>'+ emailToken +' </span> </div>  <div> Cheers!! Team TravithLog </div>' 
            };
				
	   	    transporter.sendMail(EmailVerification, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			
			    var newactivity = new LiveActivity({
			        username  :  user.name,
			        userdp    :  user.dp,     
			        activity  :  'just joined Travithlog'
		       });
		
		        newactivity.save().then((newactivity) => {			
			        res.status(200).send(token);
			        io.emit('getLiveActivity',newactivity);
		       }).catch((e) => {
			        res.status(400).send(e);
		       });
			
            });
		*/
			
        }).catch((e) => {
		    res.status(500).json({
			   error : e
		    });
	    });
	
		
    });

    
	
		
});
	

auth_route.get('/show-offline-on-logout',user_auth,async(req,res) => {
		

	const user = await User.findById(req.user._id);
	
	if(!user){
		return res.status(400).send('User Not Found');
	}
		
	user.set({
		    online   : false,
			socketId : null
	});
	
	user.save()
	    .then(() => {
			return res.status(200).send('User is Offline');
		}).catch((e) => {
			return res.status(400).send(e);
		});		

			
});
	



/********** Socket Things Ends **********/	
	
/*
	
auth_route.post('/sign_up',async(req,res) => {
		
		
	var user =  await User.findOne({email: req.body.email});
	console.log(req.body.email);
	//console.log(user);
	
	
	if(user){
		return res.status(400).send(user);
	}
	
	const salt          = await bcrypt.genSalt(10);
	const hash_password = await bcrypt.hash(req.body.password,salt);
	const emailToken = randomString.generate({
		length : 6,
		charset: 'numeric'
	});
	
	const url = req.body.name + '.' + randomString.generate(7);
	
        user = new User({
        name             : req.body.name,
        email            : req.body.email,
        password         : hash_password,
		city             : req.body.city,
		country          : req.body.country,
		emailSecretToken : emailToken,
		url              : url
		
    })

    user.save().then(() => {
        const token = user.generateAuthToken();
		
		// Email Verification Code //
		
	    let EmailVerification = {
            from    : '"TravithLog" <travithlog@noreply.com>', 
            to      :  req.body.email,
            subject : 'Confirm Email', 
            text    : 'Verify Email', 
            html    : 
			'<div> <div>   <h5> Thank you for joining with TravithLog. </h5> </div> <div>  <h5> To be able to sign in to your account,Please enter this email verification ode to continue using TravithLog </h5>  <span>'+ emailToken +' </span> </div>  <div> Cheers!! Team TravithLog </div>' 
        };
				
	   	transporter.sendMail(EmailVerification, (error, info) => {
             if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
		
		// Email Verification Code Ends //
		//
		
		var newactivity = new LiveActivity({
			user      :  user,
			activity  :  'just joined Travithlog'
		});
		
		newactivity.save().then((newactivity) => {			
			res.status(200).send(token);
			this.socket.emit('getLiveActivity',newActivity);
		}).catch((e) => {
			res.status(400).send(e);
		});
		
		
    }).catch((e) => {
		res.status(500).json({
			error : e
		})
	});
	
			
});

*/

auth_route.get('/verify-email/:emailToken',async(req,res) => {
	
	var emailToken = req.params.emailToken;
	//var vemail      = req.body.email;
	
	const user = await User.findOne({emailSecretToken : emailToken});
	
	if(!user){
		return res.status(400).send("Could not verify the email!! Please Try Again");
	}
	else if(user.active === true){
		return res.status(400).send("You have already activated the account");
	}else{
		user.set({
			active : true
		});
		const verifyUser = await user.save();
		
		//const token = user.generateAuthToken();
		if(verifyUser){
			return res.status(200).send('User Verified');
		}else{
			return res.status(400).send('Try Again');
		}
		
			
		/*
		user.active = true;
		user.save();
		const token = user.generateAuthToken();
		return res.header('auth',token).status(200).rediect('http://localhost:4200/verify-email');
		*/
				
	}
	
});


auth_route.post('/sign_in',async(req,res) => {
	let user =  await User.findOne({email: req.body.email});
	
	if(!user){
		return res.status(400).send('Invalid Email');
	}
	 	
	const validPassword =  await bcrypt.compare(req.body.password,user.password);

	if(!validPassword){
		return res.status(400).send('Invalid Password');
	}
	
    const token = user.generateAuthToken();

	res.status(200).send(token);
    
});

auth_route.post('/password_reset_link',async(req,res) => {
	
	const uEmail = req.body.email;
	
	const user = await User.findOne({email: uEmail});
	
	if(user){
		const resetSecret = randomstring.generate();
	
	    // Insert that Email Secret Token in that User model
		
		user.set({
			passwordResetToken : resetSecret
		});
		const resetUser = await user.save();
		
		if(resetUser){
			
		    let ResetPasswordLink = {
            from    : '"TravithLog" <travithlog@noreply.com>', 
            to      :  uEmail,
            subject : 'Pasword Reset', 
            text    : 'Password Reset Link', 
            html    : '<p>Click <a href="http://localhost:4200/reset-password/' + resetSecret + '">here</a> to reset your password</p>' 
            };
		
	        transporter.sendMail(ResetPasswordLink, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
				return res.status(200).send('Email Sent');
            });
			
		}
	
			
	}else{
		res.status(400).send('Could find any User with this Email');
	}
		
});

auth_route.post('/reset_password/:resetToken',async(req,res) => {
	
	// fetch that PasswordResettoken that was send in email it can be fetched on front end from url
	const passwordToken = req.params.resetToken;
	// Match that token with user model
	const user  = await User.findOne({passwordResetToken : passwordToken});
	//console.log(passwordToken);
	//console.log(user);
	// Get the password from request body and hash it
	
	const salt          = await bcrypt.genSalt(10);
	const hash_password = await bcrypt.hash(req.body.resetpassword,salt);
	// If both matched then update the password
	if(user){
		user.set({
			password : hash_password,
			passwordResetToken : null
		});
		
		const updatedUser = await user.save();
		
		if(updatedUser){
			let EmailVerification = {
                from    : '"TravithLog" <travithlog@noreply.com>', 
                to      :  user.email,
                subject : 'Password Updated', 
                text    : 'Password has been Updated', 
                html    : 
			    '<div> <div>   <h5> You password has been updated </h5> </div>  <div> Cheers!! Team TravithLog </div>  </div>' 
            };
		
		
	   	    transporter.sendMail(EmailVerification, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
				
            });
		    return res.status(200).send('Password Changed');
		}else{
			return res.status(400).send('Try Again');
		}
		
	}
	
	// then delete the reset token,make sure that field should be empty after the whole process
	// also get the email
	// match both email and reset token
	
	// if match is passed then get new password n update it with the current password
});


/*********************** FaceBook Login *********************/

auth_route.get('/auth/facebook',passport.authenticate('facebookToken',{session: false}));
  
/********************* FACEBOOK LOGIN ENDS ******************/ 


/************************************* GOOGLE LOGIN  ****************************************/

auth_route.post('/auth/google',passport.authenticate('googleToken',{session: false}));

/************************************* GOOGLE LOGIN ENDS ***************************************/




module.exports = auth_route;
