var XldField = require('XldField');


XldField_id = function(fieldName) {
	XldField.call(this, fieldName);
	
	this.isKey = function() {
		return true;
	}


}
XldField_id.prototype = Object.create(XldField.prototype); 
XldField_id.prototype.constructor = XldField_id;


module.exports = XldField_id;