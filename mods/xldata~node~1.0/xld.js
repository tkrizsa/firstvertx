var vertx = require('vertx');
var console = require('vertx/console');
var eb = vertx.eventBus;


var Node = function() {

	this.moduleName = false;
	this.PATH_DELIMITER = '\\';
	this.log = function() {
	
		for (var i in arguments) {
			var x = arguments[i];
			if (typeof x == 'undefined') {
				console.log('undefined');
			} else if (typeof x == 'object') {
				try {
					console.log(JSON.stringify(x, null, 4));
				} catch(e) {
					console.log(x);
				}
			} else {
				console.log(x);
			}
		}
	}


	this.api = function(pattern, func) {
		var address = pattern + '_' + Math.random();
		eb.publish('xld-register-http', {
			kind 	: 'api',
			pattern : pattern,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			func(req, function(obj, err, objType) {
				
				if (!err) {
					var ot = 'application/xld+json';
					if (objType)
						ot = 'application/xld.'+ objType +'+json';
					replier({
						body 			: JSON.stringify(obj),
						contentType 	: ot
					});
				} else {
					replier({
						body 			: err,
						status			: 505,
						contentType 	: 'text/plain'
					});
				}
			});
		});
	}

	this.apiPost = function(pattern, func) {
		var address = pattern + '_' + Math.random();
		eb.publish('xld-register-http', {
			kind 	: 'api',
			pattern : pattern,
			address : address,
			method : 'post'
		});
		
		eb.registerHandler(address, function(req, replier) {
			func(req, function(obj, err, objType) {
				if (!err) {
					var ot = 'application/xld+json';
					if (objType)
						ot = 'application/xld.'+ objType +'+json';
					replier({
						body 			: JSON.stringify(obj),
						contentType 	: ot
					});
				} else {
					replier({
						body 			: err,
						status			: 505,
						contentType 	: 'text/plain'
					});
				}
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


	this.template = function(templatePattern, indexPattern, fileName) {
		if (!this.moduleName)
			throw "No module name set"; 
	
		if (typeof fileName != 'string')		fileName = templatePattern;
		if (typeof indexPattern != 'string')	indexPattern = templatePattern;
		var address = 'template_'  + templatePattern + '_' + Math.random();
		eb.publish('xld-register-http', { 
			module  : this.moduleName,
			kind 	: 'template',
			pattern : '/templates/'+templatePattern,
			indexPattern : '/'+indexPattern,
			address : address
		});
		
		eb.registerHandler(address, function(req, replier) {
			vertx.fileSystem.readFile('client/'+fileName +'.html', function(err, res) {
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