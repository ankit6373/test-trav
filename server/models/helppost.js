var mongoose = require('mongoose');
const validator  = require('validator');
const User     = require('./users');

var HelpPostSchema = new mongoose.Schema({

    ownerId : {
	    type     : String,
		required :true
	},
	owner   : {
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	},
	Anonymous : {
		type    : Boolean,
		default : false
	},
	location : {
	    type     : String,
		required : true
	},
	city     : {
		type     : String,
		required : true
	},
	country  : {
	    type     : String,
		required : true
	},
	tags  :  {
	    type     : Array,
	},
	post        :  {
	    type     : String,
		required : true
	},
	viewCount  :  {
	    type   : Number
	},
	CommentCount : {
		type    : Number,
		default : 0
	},
	comment_notify : {
		type    : Boolean,
		default : false
	},
	Comments    : [{
	    CommentedUser  : {
		    type  : mongoose.Schema.Types.ObjectId,
			ref   : 'User'
		},
		comment   : {
		    type  : String
		},
		helped    : {
		    type  : Boolean,
			default : false
		},
        createdAt : Date		
	}]

},{
	timestamps : true
});

var HelpPost = mongoose.model('HelpPost',HelpPostSchema);

module.exports = {HelpPost};