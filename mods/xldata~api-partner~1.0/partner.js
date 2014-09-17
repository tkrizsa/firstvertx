var vertx = require('vertx');
var eb = vertx.eventBus;
var xld = require('xld.js');


var Elem = require('elem.js');

var Partner = function() {
	Elem.call(this);

};
Partner.prototype = Object.create(Elem.prototype); 
Partner.prototype.constructor = Partner;


Partner.prototype.load = function(partnerId, func) {
	
	var thisElem = this;

	eb.send('xld-sql-persist', { "action" : "raw",  "command" : 
			"SELECT * FROM partner WHERE partnerId = '" + partnerId + "'"
			}, function(res) 
	{
		if (res.status == 'ok') {
			xld.log("-----------------------------------------------");
			srow = '';
			for (var i in res.fields) {
				srow += res.fields[i] + ' | ';
			}
			xld.log(srow);
			xld.log("-----------------------------------------------");
			for (var i in res.results) {
				var srow = '';
				for (var j in res.results[i]) {
					srow += res.results[i][j] + ' | ';
				}
				xld.log(srow);
			}
			xld.log("-----------------------------------------------");
			
			
			for (var i in res.results) {
				var newrow = new Array();
				for (var j in res.results[i]) {
					newrow.push(res.results[i][j]);
				}
				thisElem.fields.push(newrow);
			}
			
			if (typeof func == 'function') {
				func();
			}
			
		} else {
			xld.log("SQL ERROR : " + res.message);
			if (typeof func == 'function') {
				func(res.message);
			}
		}
	});

}




module.exports = Partner;