
var Elem = require('elem.js');

var Partner = function() {
	Elem.call(this);

	
	
	
};
Partner.prototype = Object.create(Elem.prototype); 
Partner.prototype.constructor = Partner;


Partner.prototype.load = function(partnerId) {
	this.fields.push({
		partnerId : 5678,
		partnerName : 'Tomacsek Kristóf'
	});
}




module.exports = Partner;