var models=require('./user.js');
var async=require('async');
var Findr=require('./findr.js');
var _=require('underscore');
var findr=new Findr();

module.exports=function update_mongo(req,events,cb){
	async.forEach(events,function(event,callback){
		findr.write_event(event,function(err,id){
			req.events.push(id);
			callback();
		});
	},function(err){
		return cb(null,'written all the events to mongo');
	});
};
