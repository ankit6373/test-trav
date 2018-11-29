 const _ = require('lodash');
require('express-async-errors');
require('winston-mongodb')
const error  = require('./middleware/error');
const bcrypt = require('bcrypt');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb'); 
const config  = require('config');
//var {mongoose} = require('./db/mongoose');
require('./db/mongoose')();
var {User}    = require('./models/users');
var app = express();
const winston = require('winston');
app.use(bodyParser.json());

var pagal = 'wdfrg';

/*** Sockets Import ***/

const http = require('http');
var server = http.createServer(app);
const socketIO = require('socket.io');
global.io = socketIO(server);
//app.io = io;
//var io = socketIO.listen(server);
//app.set("io", io);
/*** Sockets Imports ends **/

/**** Routes Imports ****/

/**** Routes Imports Ends  ****/

winston.add(winston.transports.File,{filename: 'logfile.log'});

winston.add(winston.transports.MongoDB,{db: 'mongodb://localhost:27017/Travi'});

/*
if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

*/
//console.log('IO from server', io);

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,auth, Accept");
  next();
 });

app.use(express.static('uploads'));
 
app.use(require('./routes/auth_routes'));
app.use(require('./routes/user_routes')); 
app.use(require('./routes/trip_routes'));
app.use(require('./routes/admin_routes'));
app.use(require('./routes/feed_routes'));  
app.use(require('./routes/help_routes'));
app.use(require('./routes/explore_routes'));
app.use(error);



/*

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));

*/



/********** Socket Things  

io.on('connect',(socket) => {
	console.log('New User Connected from Client');
	
	socket.on('disconnect',() => {
        console.log('User Diconnected from Client');
        console.log(socket.id);
	});
	
	
    socket.on('showOnline',(UserId) => {
		console.log(UserId,'user is online');
	});
		
});


**********/


server.listen(3000,() => {
	console.log('Started on port 3000');
});

module.exports.io  = io;
//module.exports.pagal = io;
/*
module.exports = (io) => {
	return io;
} 
*/
module.exports = {app};
