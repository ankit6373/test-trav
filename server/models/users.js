var mongoose = require('mongoose');
const validator  = require('validator');
const jwt = require('jsonwebtoken');
const config  = require('config');
const bcrypt = require('bcrypt');

const BucketList = require('./bucket');
const Trip     = require('./trip');

var UserSchema = new mongoose.Schema({

	facebookId : {
		type : String
	},
	googleId : {
		type : String
	},
	name: {
        type      : String 
    },
    email   : {
        type      : String,
        trim      : true,
        validate  : {
            validator : validator.isEmail,
            message   : '{VALUE} is not a valid email'
        } 
    },
	method : {
		type: String
	},
    password  : {
       type      : String
    },
	passwordResetToken:{
		type : String
	},
    active : {
        type    : Boolean,
        default : false
    },
	socketId : {
		type : String
	},
    emailSecretToken : {
        type  : String
    },
	url : {
		type: String,
		unique: true
	},
    isAdmin: {
		type    : Boolean,
		default : false
	},
    username : {
        type      : String
    },
	privacy : {
		type : String,
		default : 'public'
	},
	online : {
		type: String
	},
    city : {
        type      : String
    },
    country : {
        type      : String
    },
	about : {
		type      : String
	},
	socketId : {
		type : String
	},
    dp :  {
        type      : String
	//	default   : 
    },
	cover_pic : {
		type     : String
	//	default :
	},
	helppoints : {
		type   : Number
	},
	helpedPostIds : {
		type  : Array
	},
	virtualBucketList : {
		type  : Array
	},
	bucketList : [BucketList],
	completedPlaces : [BucketList],
	Followers  : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	Following : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	Pending_Requests : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	BlockList : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	trips : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'Trip'
	}],
	helpPosts : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'HelpPost'
	}],
	Notifications : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'Notification'
	}]
});

UserSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id : this._id,isAdmin: this.isAdmin},'huhuheheh_yahoo');
    return token
}




var User = mongoose.model('User',UserSchema);

module.exports = {User};