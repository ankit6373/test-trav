var mongoose = require('mongoose');
const validator  = require('validator');
const User     = require('./users');

const PlacePointsSchema = new mongoose.Schema({
    
	user_id : {
		type  : String
	},
	user  : {
	    type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	},	
	city : {
	    type : String
	},
	country : {
	    type : String
	},
	points  : {
	    type : Number
	}
	
},{
	timestamps : true
});

var PlacePoints = mongoose.model('PlacePoints',PlacePointsSchema)

module.exports = {PlacePoints} ;
