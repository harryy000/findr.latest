var mongoose=require('mongoose');
var eventmodel=require('./user.js');
var redis=require('redis');
var client=redis.createClient();
client.on('connect',function(err){
	console.log('otha connected');
});
console.log(eventmodel.event);
var Findr=function(){

};
Findr.prototype.write_event=function(event,cb){
	var data=new eventmodel.event({
		eventid:event.id,
		name:event.name,
		start_time: event.start_time,
		end_time:event.end_time,
		location:event.location
	});
	data.save(function(err,mongo_object){
		var hmsetid=mongo_object.eventid
		var date='20140505';
		client.set(date,hmsetid,function(err,reply){
			console.log('ids are ',hmsetid + reply);
		});
		cb(null,mongo_object);
	});
};
module.exports=Findr;