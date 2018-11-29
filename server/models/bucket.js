var mongoose = require('mongoose');

const BucketList  = new mongoose.Schema({
    placeName : {
	    type      : String,
		required  : true,
		minlength : 1
	},
	reasonToGo : {
	    type      : String,
		required  : true,
		minlength : 1
	},
	whyCantGo : {
	    type      : String,
		required  : true,
		minlength : 1
	},
	Pings : [{
		type  : mongoose.Schema.Types.ObjectId,
		ref   : 'User'
	}]
})


module.exports = BucketList;