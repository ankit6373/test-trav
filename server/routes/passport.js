var {User}      = require('../models/users');
var bodyParser  = require('body-parser');
const  jwt      = require('jsonwebtoken');
const config  = require('config');
const randomString = require('randomString');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');

const FacebookTokenStrategy = require('passport-facebook-token');
/*********************** Google Login **********************/

passport.use('googleToken',new GooglePlusTokenStrategy({
    clientID: "1043730398442-928pesm6lggmbm6ajd3tq9qccpp3cb37.apps.googleusercontent.com",
    clientSecret: "P6joIpkOrPG9IYwtN-M7H59U"
 //   callbackURL: "http://localhost:4200/auth/google/callback"
},async(accessToken,refreshToken,profile,done) => {
	console.log('accessToken',accessToken);
	console.log('refreshToken',refreshToken);
	console.log('profile',profile);
	
		
	var user = await User.findOne({googleId : profile.id});
	
	if(user){
		return done(null,user);
		console.log('User Existing');
	}else{
		console.log('User New');
		//return done
		/*
		const name  = profile.name;
	    const email = profile.emails[0].value;
		
		const url = name + '.' + randomString.generate(7);
	
        user = new User({
			googleId       : profile.id,
            name             : name,
            email            : email,
		    url              : url,
            method           : 'facebook'			
        });
		
		user.save()
		    .then((user) => {
				const token = user.generateAuthToken();
				 done(null,token);
				//res.status(200).send(user);
				console.log('New User');
			}).catch((e) => {
				done(null,e)
				//res.status(400).send(e);
			});
		*/
	   
	}
	
}));
  
  
/******************* GOOGLE LOGIN ENDS **********************/ 

/************************* FaceBook Strategy ****************/

passport.use('facebookToken',new FacebookTokenStrategy({
	clientID: "184328809124571",
    clientSecret: "46c316978dec289b3510d9f58da36566",
	profileFields: ['id', 'emails', 'name']

},async(accessToken,refreshToken,profile,done) => {
	
	//console.log('profile',profile);
	//console.log('accessToken',accessToken);
	//console.log('refreshToken',refreshToken);
	
	// Find if user exists with same 
	
	var user = await User.findOne({facebookId: profile.id});
	
	if(user){
		const token = user.generateAuthToken();
	//    res.status(200).send(token);
		done(null,token);
	//	console.log('existing user');
    //	console.log(profile.id);
	}else{
	//	console.log('New User');
	//	console.log(profile.name);
	//    console.log(profile.emails[0].value);
	//    console.log(profile);
	//	console.log(profile.emails);
	//	console.log(profile.emails[0]);
    	
		
		const name  = profile.name.givenName + '' + profile.name.familyName;
	    const email = profile.emails[0].value;
		
		const url = name.givenName + '.' + randomString.generate(7);
	
	//    console.log(name);
	//	console.log(email);
    //    console.log(url);
	
	   
        user = new User({
			facebookId       : profile.id,
            name             : name,
            email            : email,
		    url              : url,
            method           : 'facebook'			
        });
		
		user.save()
		    .then((user) => {
				 const token = user.generateAuthToken();
				 done(null,token);
			//	 console.log(token)
			//	//res.status(200).send(user);
				console.log('New User');
			}).catch((e) => {
				done(null,e)
				//res.status(400).send(e);
			});
		
	}
	
	//

	
}));

/********************* FaceBook Strategy Ends ***************/

