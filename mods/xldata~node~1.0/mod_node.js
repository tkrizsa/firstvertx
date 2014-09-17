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

eb.registerHandler('xld-register-api', function(a) {
	console.log('API reg arrived');
	
	routeMatcher.get('/api' + a.pattern, function(request) {
	
	
		console.log('HTTP ' + request.method() + ' ' + request.uri());
		

		
		var r = {};
		r.params = {};
		request.params().forEach(function(k, val) {
			r.params[k] = val;
		});

		
		eb.send(a.address, r, function(reply) {
			request.response.end(JSON.stringify(reply));
		});
	
	
	});
});



var server = vertx.createHttpServer();
server.requestHandler(routeMatcher);

server.listen(8080, 'localhost');

 



// ========================== LOAD MODULES ===========================

var config = {};

container.deployModule("xldata~site~1.0", config, function(err, deployID) {
  if (!err) {
    //console.log("The verticle has been deployed, deployment ID is " + deployID);
	//eb.publish('test.address', 'Működik az eventbus2');
  } else {
    console.log("Deployment failed! " + err.getMessage());
  }
});


container.deployModule("xldata~api-partner~1.0", config, function(err, deployID) {if (err) {console.log("Deployment failed! " + err.getMessage());}});
//container.deployModule("xldata~api-flowpartner~1.0", config, function(err, deployID) {if (err) {console.log("Deployment failed! " + err.getMessage());}});


