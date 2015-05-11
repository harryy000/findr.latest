var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8081;
//var config = require('./config');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var request = require('request');
var async = require('async');
var responseTime = require('response-time');
//middleware
/*app.use(bodyParser.urlencoded({
	extended: true
}));
*/

mongoose.path = 'mongodb://localhost:27020/findr_dev';
mongoose.connect(mongoose.path);
require('./passportauth.js')(passport);

//app.use(express.logger('dev'));


app.use(responseTime());
app.use(cookieParser());
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(session({
	secret: 'fuckmesanta',
	resave: 'true',
	saveUninitialized: 'true'
}));
app.use(passport.initialize());
app.use(passport.session());
var router = express.Router();


//router

function get_events(req, res, next) {
	var buffer = '';
	console.log('getting events');
	var options = {
		// here only the domain name		// (no http/https !)
		//port:443,
		uri: 'https://graph.facebook.com/10152433617536114/events/not_replied?access_token=' + req.user.token,
		//uri: '/me/events',// the rest of the url with parameters if needed
		method: 'GET' // do GET
	};
	//var uri = 'http://graph.facebook.com/' + req.user.fbid+'/events';

	request(options, function(err, res, body) {
		req.events_body = JSON.parse(body).data;
		var event_ids = [];
		console.log(req.events_body);
		async.each(req.events_body, function(event_id, callback) {
			event_id = event_id.id;
			//console.log(event_id);
			var options = {
				// here only the domain name		// (no http/https !)
				//port:443,
				uri: 'https://graph.facebook.com/' + event_id + '?access_token=' + req.user.token,
				//uri: '/me/events',// the rest of the url with parameters if needed
				method: 'GET' // do GET
			};
			request(options, function(err, res, body) {
				body = JSON.parse(body);
				if (body.privacy === 'OPEN') {
					req.event = {
						name: body.name,
						location: body.location,
						owner.name: body.owner.name,
						start_time: body.start_time,
						end_time: body.end_time,
						timezone: body.timezone,
						desc: body.description,
						country: body.venue.country,
						city: body.venue.city,
						lat: body.venue.latitude,
						lon: body.venue.longitude,
						street: body.venue.street,
						zip: body.venue.zip
					};
				}
			});
			var options_attending = {
				uri: 'https://graph.facebook.com/' + event_id + '/attending' + '?access_token=' + req.user.token,
				//uri: '/me/events',// the rest of the url with parameters if needed
				method: 'GET' // do GET
			};
			request(options_attending, function(err, res, body_attending) {
				body_attending = JSON.parse(body_attending).data
				console.log(body_attending);
				async.each(body_attending, function(prospects, callback) {
					console.log(prospects.id);
					callback();
				}, function(err) {
					if (err) return err;
					callback();
				});
			});

		}, function(err) {
			//req.event_body = event_ids;
			next();
		});
		//req.event_body = req.event_body.data[0].id;

	});

};

router.get('/auth/facebook', passport.authenticate('facebook', {
	scope: ['public_profile', 'user_events', 'user_likes', 'rsvp_event', 'user_friends', 'user_photos', 'friends_events']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/prof',
	failureRedirect: '/fberr'
}));

router.get('/', function(req, res) {
	if (!req.isAuthenticated()) {
		res.render('index.ejs');
	} else {
		res.redirect('/prof');
	}
});

router.get('/prof', isloggedin, get_events, function(req, res) {
	//	console.log(req.event_body);
	res.json({
		'message ': req.event_body
	});
});
router.get('/fberr', function(req, res) {
	res.json({
		message: 'fb login issue here'
	});
});

router.get('/:id', function(req, res) {
	res.json('we will let him/her see the users profile');
});

router.get('/events', function(req, res) {
	res.json({
		message: 'list of events to be retried'
	});
});

router.get('/events/:id', function(req, res) {
	res.json({
		message: 'event details'
	});
});

function isloggedin(req, res, next) {
	if (!req.isAuthenticated())
		return res.redirect('/');
	next();

};
app.use('', router);
app.listen(port);
console.log('it just listens to ' + port + ' so chill');