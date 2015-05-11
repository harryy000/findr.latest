var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	age: {
		type: Number
	},
	gender: {
		type: String
	},
	preference: {
		type: String
	},
	created_at: Date,

	updated_at: {
		type: Date,
		default: Date.now
	},
	token: {
		type: String
	},
	fbid: {
		type: Number
	},
	likes: [{
		type: String
	}],
	events_yes: [{
		type: Schema.Types.ObjectId,
		ref: 'event'
	}],
	events_maybe: [{
		type: Schema.Types.ObjectId,
		ref: 'event'
	}],
	events_invited: [{
		type: Schema.Types.ObjectId,
		ref: 'event'
	}],
	events_past: [{
		type: Schema.Types.ObjectId,
		ref: 'event'
	}],
	events_like: [{
		type: Schema.Types.ObjectId,
		ref: 'event'
	}]
});

var CustomerSchema = new Schema({
	_id: Number,
	userid: {
		type: Schema.Types.ObjectId
	}
});
var Customers = mongoose.model('customers', CustomerSchema, 'customers');
UserSchema.pre('save', function(next) {
	var self = this;
	Customers.findById(this.fbid, function(err, data) {
		console.log('error' + err);
		console.log(data);
		if (!data) {
			var customers = new Customers();
			customers._id = self.fbid;
			customers.userid = self._id;
			console.log(customers);
			customers.save(function(err) {
				if (err) return console.log(err);
				return next();
			});
		}
	});

});

var Usermodel = mongoose.model('user', UserSchema, 'user');

var EventSchema = new Schema({
	eventid: Number,
	invited: Number,
	going: Number,
	notreplied: Number,
	maybe: Number,
	name:String,
	start_time:String,
	end_time:String,
	location:String,
	users_going: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	users_maybe: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	users_noreply: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}]
});

var Eventmodel = mongoose.model('event', EventSchema, 'event');
module.exports = {
	User: Usermodel,
	event: Eventmodel
};