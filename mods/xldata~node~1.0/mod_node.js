var vertx = require('vertx');
var console = require('vertx/console');
var container = require('vertx/container');
var eb = vertx.eventBus;
var xld = require('xld');
var rm = require('xldRouteMatcher');



console.log('XLD Started...');




// ===================================== RUN SERVER =====================================


var addRoute = function(method, pattern, address, module) {

	rm.register({method : method, pattern : pattern, address : address});
	console.log('add pattern: "'+pattern+'"; address: "'+address+'"; module: "'+ module + "'");
}



var registeredPatterns = {};

var regFunc = function(a) {
	method = 'get';
	if (a.method) {
		method = a.method.toLowerCase();
	}
	if (registeredPatterns[method + '|' + a.pattern]) {
		throw "PATTERN ALREADY REGISTERED!";
	}
	registeredPatterns[method + '|' + a.pattern] = a.address;
	addRoute(method, a.pattern, a.address, a.module);
	if (a.kind == 'template') {
		if (registeredPatterns['get|' + a.indexPattern]) {
			throw "PATTERN ALREADY REGISTERED!";
		}
		addRoute('get', a.indexPattern, '_index', a.module);
	}
	
}	

eb.registerHandler('xld-register-http', regFunc);



var server = vertx.createHttpServer();
server.ssl(true);
server.keyStorePath('xldata.jks');
server.keyStorePassword('qwert1978');

server.requestHandler(function(request) {
		console.log('HTTP ' + request.method() + ' ' + request.uri());
		x = rm.check(request.method(), request.path());
		if (!x) {
			request.response.end('No route found');
			return;
		}
		xld.log('found pattern: "'+x.route.pattern);
		var r = {};
		r.params = {};
		for (var i in x.params) {
			r.params[i] = x.params[i];
		}
		request.params().forEach(function(k, val) {
			r.params[k] = val;
		});
		
		r.path = request.path();
		var addr = x.route.address;
		if (addr == '_index') {
			addr = registeredPatterns['get|/'];
			r.path = '/';
		}

		if (method == 'put' || method == 'post') {
			// should be dangerous in case of large uploaded body, whole body kept in memory!
			request.bodyHandler(function(body) {
				r.body = body.toString();
				eb.send(addr, r, function(reply) {
					if (reply.status) {
						request.response.statusCode(reply.status);
					}
					if (reply.contentType) {
						request.response.putHeader('content-type', reply.contentType);
					}
					request.response.end(reply.body);
				});
			});		
		} else {
			eb.send(addr, r, function(reply) {
				if (reply.status) {
					request.response.statusCode(reply.status);
				}
				if (reply.contentType) {
					request.response.putHeader('content-type', reply.contentType);
				}
				request.response.end(reply.body);
			});
		}




});

server.listen(8080, '0.0.0.0');

xld.http('/parseUrls', function(req, replier) {
	replier({body : 'hello parser!'});
	var modules = {};
	var urls = JSON.parse(req.params.urls);
	for (var i in urls) {
		var url = urls[i];
		var p = rm.check('get', url);
		
		xld.log('================= check url ================== : ', url, p);
		if (p && p.route.module) {
			modules[p.route.module] = true;
		}
	}
	var mc = modules.length;
	for (var m in modules) {
		
	
	
	}
	
});




// ========================== LOAD MODULES ===========================
var config = {};


container.deployModule("xldata~site~1.0", 				config, function(err, deployID) {if (err) {console.log("Deployment failed! " + err.getMessage());}});
container.deployModule("xldata~api-partner~1.0", 		config, function(err, deployID) {if (err) {console.log("Deployment failed! " + err.getMessage());}});
//container.deployModule("xldata~api-flowpartner~1.0", 	config, function(err, deployID) {if (err) {console.log("Deployment failed! " + err.getMessage());}});


var sqlConfig = {
  "address" : 'xld-sql-persist',
  "connection" 		: 'MySQL',
  "host" 			: 'localhost',
  "port" 			: 3306,
  "maxPoolSize" 	: 10,
  "username" 		: 'root',
  "password" 		: 'qwert1978',
  "database" 		: 'flow'
}

container.deployModule("io.vertx~mod-mysql-postgresql~0.3.0-SNAPSHOT", 	sqlConfig, function(err, deployID) {
	if (err) {
		console.log("Deployment failed! " + err.getMessage());
	} else {
	}

	
});


