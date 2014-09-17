
var Partner = require('partner.js');

var FlowPartner = function() {
	Partner.call(this);

	
	this.load = function(partnerId) {
		Partner.prototype.load.call(this, partnerId);
		
		this.fields[0].partnerStatus = 'programozó';

	}
	
	
};
FlowPartner.prototype = Object.create(Partner.prototype); 
FlowPartner.prototype.constructor = FlowPartner;



module.exports = FlowPartner;