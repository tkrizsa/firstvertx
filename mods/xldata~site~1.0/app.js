var vertx = require('vertx');
var console = require('vertx/console');

console.log('XLD site started ...');



var eb = vertx.eventBus;

var myHandler = function(message) {
  console.log('I received a message ' + message);
}

eb.registerHandler('test.address', myHandler);



