var async = require('async');
//var request = require('request');

var Fb = require('./fb.js');
var fb = new Fb();
module.exports = function(req, res, next) {
	function get_events_ids(callback) {
		var event_ids = [];
		async.parallel([get_attending,get_maybe, get_not_replied, get_past], function(err) {
			if (err) return callback(err);
			console.log('final parallel callback for 1st parallel');
			callback();
		});
	};
	function get_attending(callback) {
		fb.get('/events/attending', req.user.fbid, req.user.token, function(err, events) {
			if (err) return callback(err);
			events = JSON.parse(events).data;
			async.each(events, function(event_data, callback) {
				var event_attending_id = event_data.id;
				async.parallel([function(callback) {
					callback();
				},
				function(callback) {
					fb.get(':/attending_count', event_attending_id, req.user.token, function(err, attending_count) {
						attending_count = JSON.parse(attending_count);
						console.log(attending_count.attending_count);
						callback();
					});
				},
				function(callback) {
					fb.get(':/maybe_count', event_attending_id, req.user.token, function(err, maybe_count) {
						maybe_count = JSON.parse(maybe_count)
						console.log(maybe_count.maybe_count);
						callback();
					});
				}], function(err) {
					callback(); //will call the async.each callback
				});
			}, function(err) {
				console.log("attending couting");
				event_ids = ''
				return callback(); //this will not go to get_ee,this will try to fetch the final call ack
			});
		});
};

function get_maybe(callback) {
	fb.get('/events/maybe', req.user.fbid, req.user.token, function(err, events_maybe) {
		console.log('may be');
		callback();
	});
};
function get_not_replied(callback) {
	console.log('not_replied');
	fb.get('/events/not_replied', req.user.fbid, req.user.token, function(err, events_not_replied) {
		console.log(' i am here');

		callback();
	});
};
function get_past(callback) {
	console.log('past');
	callback();
};
function write_events(callack){
	callback();
})
async.series([get_events_ids], function(err) {
	console.log("last callback");
	next();
});
