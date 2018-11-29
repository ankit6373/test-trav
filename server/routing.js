var express     = require('express');
 
module.exports = function(io){

    let router = express.Router();
	
	app.use(require('./routes/auth_routes'));
    app.use(require('./routes/user_routes')); 
    app.use(require('./routes/trip_routes'));
    app.use(require('./routes/admin_routes'));
    app.use(require('./routes/feed_routes'));  
    app.use(require('./routes/help_routes'));
    app.use(require('./routes/explore_routes'));

	return router;
	
}