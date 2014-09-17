var Elem = function() {


	var vertx = require('vertx');
	var console = require('vertx/console');

	this.fields = {};


	this.get = function() {
		return this.fields;
	}


}

module.exports = Elem;