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
			kind 	: 'api',
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
			kind 	: 'site',
			pattern : pattern,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			func(req, function(reply) {
				replier(reply);
			});
		});
	}


	this.template = function(templateName) {
		var address = 'template'  + templateName + '_' + Math.random();
		eb.publish('xld-register-http', {
			kind 	: 'template',
			pattern : '/'+templateName,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			vertx.fileSystem.readFile('client/'+templateName +'.html', function(err, res) {
				if (!err) {
					var x = res.toString();
					var ct = 'text/html';
					replier({body : x, contentType : ct});
				} else {
					replier({body : '404 template not found', status : 404});
				}
			});			
		});
	}





}

module.exports = new Node();