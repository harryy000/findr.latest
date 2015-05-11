var request = require('request');
var Fb = function() {
	/*	this.req = {
			user: {
				fbid: "10151948721576114",
				token: "CAACEdEose0cBAHoArKqjy801hyZCyPjTSo0XsivUW4mGhXjeyrV6WZBWJglmiMNRcD79oOZA0Ogp6HOZCvfezZCDZCdpFYYOafbyo490jbtNdRAqIjtWOVZCWOZBZB4Fk7xVE9OoGDZAHp8zPqSqqrgvBJXa7WCOpAbJQZBk75IdrsDU663Q6zb8VK4vu8u95NzWbvxZBmDdsvA9FNTmZCDz8PXrIcEziiSVWoE4ZD"
			}
		};
		*/
};

Fb.prototype.get = function(uri, fbid, token, callback) {
	if (uri.substring(0, 2) === ':/') {
		uri = uri.replace(":/", "/?fields=");
		uri = uri + '&';
	} else {
		uri = uri + '?';
	}
	var options = {
		uri: 'https://graph.facebook.com/' + fbid + uri + 'access_token=' + token,
		method: 'GET'
	};
	request(options, function(err, res, body) {
		if (!body) return callback("no data");
		body = JSON.parse(body).data;
		return callback(err, body);
	});
};
module.exports = Fb;