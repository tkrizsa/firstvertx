var vertx = require('vertx');
var console = require('vertx/console');
var eb = vertx.eventBus;


var Node = function() {

	this.log = function(x) {
		console.log(x);
	}


	this.api = function(pattern, func) {
		var address = pattern + '_' + Math.random();
		eb.publish('xld-register-api', {
			pattern : pattern,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			func(req, function(resp) {
				replier(resp);
			});
		});
	}





}

module.exports = new Node();