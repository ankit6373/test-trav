const jwt    = require('jsonwebtoken');
const config = require('config');

function admin_auth(req,res,next){
    const token = req.header('auth');	
	if(!token){
		res.status(401).send('Access denied. No token provided');
	}
	try{
		const decoded = jwt.verify(token,'huhuheheh_yahoo');
		req.user = decoded;
		if(!req.user.isAdmin){
			res.status(403).send('Acess Denied');
		}
		next();
	}catch(e){
		res.status(400).send('Invalid token');
	}
}

module.exports = admin_auth;