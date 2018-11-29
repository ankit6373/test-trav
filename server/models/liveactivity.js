var mongoose = require('mongoose');
const validator  = require('validator');


var LiveActivitySchema = new mongoose.Schema({

    username : {
	    type : String
	},
	userdp   : {
		type : String
	},
	activity : {
	    type : String
	},
	placename : {
	    type  : String
	}

},{
	timestamps : true
});

var LiveActivity = mongoose.model('LiveActivity',LiveActivitySchema);

module.exports = {LiveActivity};