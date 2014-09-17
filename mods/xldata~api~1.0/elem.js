var Elem = function() {

	var vertx = require('vertx');
	var console = require('vertx/console');

	this.fields = new Array();


	this.get = function() {
		return this.fields;
	}

}

Elem.prototype.extend = function(obj) {
	for(var e in Elem) {
		if (Elem.hasOwnProperty(e)) {
			obj[e] = Elem[e];
		
		}
	}
}


module.exports = Elem;