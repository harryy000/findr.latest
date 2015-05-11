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
var process_events = require('./asynctest.js');

//middleware
/*app.use(bodyParser.urlencoded({
	extended: true
}));
*/

mongoose.path = 'mongodb://localhost:27030/findr_dev';
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

router.get('/auth/facebook', passport.authenticate('facebook', {
	scope: ['public_profile', 'user_events', 'user_likes', 'rsvp_event', 'user_friends', 'user_photos']
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
router.get('/prof', isloggedin, process_events,function(req, res) {
	console.log(req.events);
	res.json({
		'message ': req.events
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