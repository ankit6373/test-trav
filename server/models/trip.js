var mongoose = require('mongoose');
const validator  = require('validator');
const User     = require('./users');

const TripSchema    = new mongoose.Schema({
    tagLine : {
		type      : String,
		required  : true,
		minlength : 1
	},
	tags : {
		type     : Array
	},
	location : {
		type     : String,
		required : true,
		minlength : 1
	},
	post_images : {
		type     : Array
	},
	story : {
		type     : String,
	},
	NoOfComments : {
		type    : Number,
		default : 0
	},
	NoOfLikes : {
		type    : Number,
		default : 0
	},
	like_notify : {
		type    : Boolean,
		default : false
	},
	comment_notify : {
		type    : Boolean,
		default : false
	},
	Likers  : [{
		type : mongoose.Schema.Types.ObjectId,
		ref  : 'User'
	}],
	Comments : [{
		commentedUser : {
			type : mongoose.Schema.Types.ObjectId,
		    ref  : 'User'
		},
		comment : {
			type : String
		},
		replies : [{
			repliedUsers : {
			    type : mongoose.Schema.Types.ObjectId,
		        ref  : 'User'
		    },
		    reply : {
			    type : String
		    }
		}]
	}]
},{
	timestamps : true
});


var Trip = mongoose.model('Trip',TripSchema);

module.exports = {Trip};
