var vertx = require('vertx');
var console = require('vertx/console');
var container = require('vertx/container');
var eb = vertx.eventBus;



console.log('XLD Started...');




// ===================================== RUN SERVER =====================================
var routeMatcher = new vertx.RouteMatcher();

routeMatcher.noMatch(function(req) {
    req.response.end('Nothing matched');
});

var registeredPatterns = {};

var regFunc = function(a) {
	console.log('API REG ' + a.pattern);
	if (registeredPatterns[a.pattern]) {
		throw "PATTERN ALREADY REGISTERED!";
	}
	registeredPatterns[a.pattern] = true;
	routeMatcher.get('' + a.pattern, function(request) {
		console.log('HTTP ' + request.method() + ' ' + request.uri());
		var r = {};
		r.params = {};
		request.params().forEach(function(k, val) {
			r.params[k] = val;
		});
		
		r.path = request.path();

		
		eb.send(a.address, r, function(reply) {
			if (reply.status) {
				request.response.statusCode(reply.status);
			}
			if (reply.contentType) {
				request.response.putHeader('content-type', reply.contentType);
			}
			request.response.end(reply.body);
		});
	
	
	});
}

eb.registerHandler('xld-register-http', regFunc);


var server = vertx.createHttpServer();

server.ssl(true);
server.keyStorePath('xldata.jks');
server.keyStorePassword('qwert1978');

server.requestHandler(routeMatcher);

server.listen(8080, 'localhost');

 



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


