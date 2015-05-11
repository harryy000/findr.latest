function Resource() {

};

var ordered = {
	actions: [
		'index', //  GET   /
		'new', //  GET   /new
		'create', //  POST  /
		'show', //  GET   /:id
		'edit', //  GET   /edit/:id
		'update', //  PUT   /:id
		'patch', //  PATCH /:id
		'destroy', //  DEL   /:id
	],
	methods: [
		'get',
		'post',
		'put',
		'patch',
		'delete'
	]
};

ordered.methods.forEach(function(method) {
	//console.log(method);
	Resource.prototype[method] = function(path, fn) {

		if ('function' == typeof path || 'object' == typeof path) {
			fn = path, path = '';
		}
		Resource.prototype.map(method, path, fn);
		console.log(method);
		return this;
	};
	console.log(method);
});