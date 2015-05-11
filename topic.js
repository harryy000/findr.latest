var mongoose = require('mongoose');
var schema = mongoose.Schema;

var topicSchema = new schema({
	title: String,
});
module.exports = mongoose.model('Topic', topicSchema);