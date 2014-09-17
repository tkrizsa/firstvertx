var vertx = require('vertx');
var console = require('vertx/console');

console.log('XLD API Flow/Partner started ...');

var partner = require('partner.js');

var eb = vertx.eventBus;

var myHandler = function(message, replier) {
	var p = partner.getPartner();
	p.partnerState = 'exxxxpanded';
	replier(p);
}

eb.registerHandler('apiget-partner', myHandler);
