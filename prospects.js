var async = require('async');
var request = require('request');

function get_events(callback) {
	var buffer = '';
	var options = {
		// here only the domain name		// (no http/https !)
		//port:443,
		uri: 'https://graph.facebook.com/10152433617536114/events/not_replied?access_token=' + req.user.token,
		//uri: '/me/events',// the rest of the url with parameters if needed
		method: 'GET' // do GET
	};
	//var uri = 'http://graph.facebook.com/' + req.user.fbid+'/events';

	request(options, function(err, res, body) {
		body = JSON.parse(body).data;
		var event_ids = [];
		async.each(body, function(event_id, callback) {
			//			console.log(event_id);
			callback();
		}, function(err) {
			req.event_body = event_ids;
			next();
		});
		//req.event_body = req.event_body.data[0].id;

	});
};

function get_users(callback) {

};

function show_prospects(callback) {

};

exports.prospects = function(req, res, next) {
	async.series([get_events, get_users, show_prospects], function(err) {
		if (err) return next(err);
		next();
	});
};