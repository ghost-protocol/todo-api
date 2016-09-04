


//use module exports to expose middleware

var middleware = {
	requireAuthentication: function (req, res, next){
		console.log('private route hit!');
		next();
	},
	//new Date().toString()
	logger: function (req, res, next){
		console.log('Request: ' + new Date().toString() + ' ' + req.method + ' ' + req.originalUrl);
		next();
	}
};

module.exports = middleware;