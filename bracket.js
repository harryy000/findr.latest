function get_attending(callback) {
	fb.get('/events/attending', req.user.fbid, req.user.token, function(err, events) {
		if (err) return callback(err);
		events = JSON.parse(events).data;
		async.each(events, function(event_data, callback) {
			var event_attending_id = event_data.id;
			callback();
		}, function(err) {
			console.log("attending couting");
			event_ids = ''
				return callback(); //this will not go to get_ee,this will try to fetch the final call ack
			});
	});
};