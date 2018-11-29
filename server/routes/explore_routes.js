var express     = require('express');
var {mongoose}  = require('../db/mongoose.js');
var {User}          = require('../models/users');
var { LiveActivity } = require('../models/liveactivity');
var {Notification}  = require('../models/notification');
var {HelpPost}      = require('../models/helppost');
var {PlacePoints}   = require('../models/placepoints');
const _ = require('lodash');

var explore_route  = express.Router();
var bodyParser  = require('body-parser');
const user_auth = require('../middleware/user_auth');
const asyncMiddleware = require('../middleware/async');

/*
explore_route.post('/get-user-forplace/:cityname',async(req,res) => {
	
	/*
	const cityName = req.params.cityname
	
    const users = await User.find(
	    'city' : cityName
	)
	
	
	
});

// get travellers acc to country

explore_route.get('/get-country-travellers/:country',async(req,res) => {
	
	const countryName = req.params.country;
	
	const travellers = User.find({country : countryName});
	
	if(travellers){
		return res.status(200).send(travellers);
	}else{
		return res.status(400).send('Could not fetch any traveller');
	}
	
});

*/


explore_route.get('/traveller-online-count-for-usa',async(req,res) => {
	    
		/*
		var usaonline =  await User.countDocuments({
			                $and : [
			                    { country : 'usa' },
			                    { online  : true  }
			                ]
		                    		
	                    });
		if(usaonline){
			return res.status(200).send({'online' : usaonline});
		}else{
			return res.status(400).send('Error');
		}
	    
		*/
		
		User.countDocuments({
			$and : [
			        { country : 'usa' },
			        { online  : true  }
			]
		}).then((usaonline) => {
			return res.status(200).send({'online' : usaonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
});

explore_route.get('/traveller-online-count-for-china',async(req,res) => {
	
	
	   	User.countDocuments({
			$and : [
			        { country : 'china' },
			        { online  : true  }
			]
		}).then((chinaonline) => {
			return res.status(200).send({'online' : chinaonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
	
	   /*
		var chinaonline =  await User.find({
			                $and : [
			                    { country : 'china' },
			                    { online  : true  }
			                ]
		                    		
	                    }).count();
		if(chinaonline){
			//console.log(chinaonline);
			return res.status(200).send({'online': chinaonline});
		}else{
			return res.status(400).send('Error');
		}
	*/
	
});

explore_route.get('/traveller-online-count-for-canada',async(req,res) => {
	
	/*
		var canadaonline =  await User.countDocuments({
			                $and : [
			                    { country : 'canada' },
			                    { online  : true  }
			                ]
		                    		
	                    });
		if(canadaonline){
			return res.status(200).send({'online' :canadaonline});
		}else{
			return res.status(400).send('Error');
		}
	*/
		User.countDocuments({
			$and : [
			        { country : 'canada' },
			        { online  : true  }
			]
		}).then((canadaonline) => {
			return res.status(200).send({'online' : canadaonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
	
});

explore_route.get('/traveller-online-count-for-india',async(req,res) => {
	
		User.countDocuments({
			$and : [
			        { country : 'india' },
			        { online  : true  }
			]
		}).then((indiaonline) => {
			return res.status(200).send({'online' : indiaonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
});

explore_route.get('/traveller-online-count-for-australia',async(req,res) => {
	
		User.countDocuments({
			$and : [
			        { country : 'australia' },
			        { online  : true  }
			]
		}).then((ausonline) => {
			return res.status(200).send({'online' : ausonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
});

explore_route.get('/traveller-online-count-for-singapore',async(req,res) => {
	
		User.countDocuments({
			$and : [
			        { country : 'singapore' },
			        { online  : true  }
			]
		}).then((singaonline) => {
			return res.status(200).send({'online' : singaonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
});

explore_route.get('/traveller-online-count-for-france',async(req,res) => {
	
		User.countDocuments({
			$and : [
			        { country : 'france' },
			        { online  : true  }
			]
		}).then((franceonline) => {
			return res.status(200).send({'online' : franceonline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
	
});

explore_route.get('/traveller-online-count-for-honkong',async(req,res) => {
	
	    User.countDocuments({
			$and : [
			        { country : 'honkong' },
			        { online  : true  }
			]
		}).then((hononline) => {
			return res.status(200).send({'online' : hononline})
		}).catch((e) => {
			return res.status(400).send(e);
		});
});

explore_route.get('/get-activities-from-db',async(req,res) => {
	
	const activity = await LiveActivity.find()
	                                     .limit(15)
										 .sort({createdAt: -1});
	
    if(activity){
		return res.status(200).send(activity);
	}else{
		return res.status(400).send('Error');
	}
	
});

module.exports = explore_route;
