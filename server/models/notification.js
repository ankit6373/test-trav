var mongoose = require('mongoose');
const validator  = require('validator');
const User     = require('./users');

var NotificationSchema = new mongoose.Schema({

	tripId   : {
		type : String
	},
	postId  : {
		type  : String
	},
	type  : {
		type : String
	},
	content  : {
		type : String  //like,commment or following
	},
	fromUser : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}],
	read     : {
		type    : Boolean,
		default : false
	}
	
},{
	timestamps : true
});

var Notification = mongoose.model('Notification',NotificationSchema);

module.exports = {Notification};