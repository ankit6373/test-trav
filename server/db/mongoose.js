var mongoose  = require('mongoose');
const config  = require('config');
const winston = require('winston');

module.exports = function(){

    const db = config.get('db');
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`));
}
	
/*	
mongoose.Promise = global.Promise;
mongoose.connect(db);
module.exports = {mongoose};

*/
