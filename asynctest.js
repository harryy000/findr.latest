var async = require('async');
//var request = require('request');

var Fb = require('./fb.js');
var fb = new Fb();
var update_mongo=require('./update_mongo.js')
module.exports = function(req, res, next) {
	req.events=[];
	function get_events_ids(callback) {
		var event_ids = [];
		async.parallel([get_attending, get_maybe, get_not_replied], function(err) {
			if (err) return callback(err);
			console.log('final parallel callback for 1st parallel');
			callback();
		});
	};

	function get_attending(callback) {
		fb.get('/events/attending', req.user.fbid, req.user.token, function(err, events_attending) {
			update_mongo(req,events_attending,function(err,done){
				console.log(done);
				return callback();
			});
		});
	};

	function get_maybe(callback) {
		fb.get('/events/maybe', req.user.fbid, req.user.token, function(err, events_maybe) {
			update_mongo(req,events_maybe,function(err,done){
				console.log(done);
				return callback();
			});
		});
	};

	function get_not_replied(callback) {
		console.log('not_replied');
		fb.get('/events/not_replied', req.user.fbid, req.user.token, function(err, events_not_replied) {
			update_mongo(req,events_not_replied,function(err,done){
				console.log(done);
				return callback();
			});
		});
	};
	async.series([get_events_ids], function(err) {
		console.log("last callback");
		next();
	});
};
