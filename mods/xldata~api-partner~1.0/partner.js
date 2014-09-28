var vertx = require('vertx');
var eb = vertx.eventBus;
var xld = require('xld.js');


var Elem = require('elem.js');

var Partner = function() {
	Elem.call(this);
	
	this.fields.push('partnerId');
	this.fields.push('partnerName');
	this.fields.push('partnerStatus');
	this.keyName 	= 'partnerId';
	this.tableName 	= 'partner';

};
Partner.prototype = Object.create(Elem.prototype); 
Partner.prototype.constructor = Partner;


Partner.prototype.load = function(partnerId, func) {
	this.loadSql("SELECT * FROM partner WHERE partnerId = '" + partnerId + "'", function(err) {
		if (typeof func == 'function') func(err);
	});
}

Partner.prototype.loadList = function(func) {
	this.loadSql("SELECT * FROM partner ", function(err) {
		if (typeof func == 'function') func(err);
	});
}

Partner.prototype.addLink = function(row) {
	row.self = {
		href : '/api/partner/' + row.partnerId
	}
	row.gui = {
		href : '/partners/' + row.partnerId
	}
}



module.exports = Partner;