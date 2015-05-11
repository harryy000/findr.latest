module.exports = function(app) {
	var authenticator = function(req, res, next) {
		//do some stuff here
		if (req.url === '/') {
			req.privateKey = 'value from Basic Auth header'; //This can be shared accross middlewares.
		} else {
			req.privateKey = 'how are you'; //This can be shared accross middlewares.

		}
		next(); //don't forget to call this.
	};
	return authenticator;
};