var vertx = require('vertx');
var eb = vertx.eventBus;
var xld = require('xld.js');


var Model = require('xldModel.js');

var Partner = function() {
	Model.call(this);
	
	this.tableName('partner');
	this.fieldAdd('partnerId', 'id');
	this.fieldAdd('partnerName', 'txtProp', 100);
	this.fieldAdd('partnerStatus', 'enumProp', ['programmer', 'customer']);
};
Partner.prototype = Object.create(Model.prototype); 
Partner.prototype.constructor = Partner;


Partner.prototype.addLink = function(row) {
	row.self = {
		href : '/api/partner/' + row.partnerId
	}
	row.gui = {
		href : '/partners/' + row.partnerId
	}
}



module.exports = Partner;