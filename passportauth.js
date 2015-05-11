var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config.js');
var User = require('./user.js').User;
var mongoose = require('mongoose');


module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {

            done(null, user);
        });
    });
    passport.use(new FacebookStrategy({
        //clientID:'326267757577358',
        clientID: 326267757577358,
        clientSecret: '0ef2833091ba7432abcd93605bc2c2ef',
        callbackURL: 'http://localhost:8081/auth/facebook/callback'
    }, function(token, refreshToken, profile, done) {
        console.log('authenticating');
        process.nextTick(function() {
            User.findOne({
                'fbid': profile.id
            }, function(err, user) {
                if (user) {
                    // req.user = user;
                    return done(null, user);
                } else {

                    var newuser = new User();
                    newuser.fbid = profile.id;
                    newuser.token = token;
                    newuser.age = profile.age;
                    newuser.gender = profile.gender;
                    console.log('comes here' + newuser);
                    newuser.save(function(err) {
                        //console.log('err is ',err);
                        if (err) return done(err, newuser);
                        //req.user = newuser;
                        return done(null, newuser);
                    });
                }
            });
        });
    }));
};