var vertx = require('vertx');
var console = require('vertx/console');
var eb = vertx.eventBus;


var Node = function() {

	this.log = function(x) {
		console.log(x);
	}


	this.api = function(pattern, func) {
		var address = pattern + '_' + Math.random();
		eb.publish('xld-register-http', {
			pattern : pattern,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			func(req, function(obj, objType) {
				replier({
					body 			: JSON.stringify(obj),
					contentType 	: 'application/xldata.'+ objType +'+json'
				});
			});
		});
	}


	this.http = function(pattern, func) {
		var address = pattern + '_' + Math.random();
		eb.publish('xld-register-http', {
			pattern : pattern,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			func(req, function(reply) {
				replier(reply);
			});
		});
	}





}

module.exports = new Node();