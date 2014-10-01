var XldField = require('XldField');


XldField_enumProp = function(fieldName, options) {
	XldField.call(this, fieldName);
	
	var _options = options;
	
	this.options = function(x) {
		if (typeof x == 'array')
			_options = x;
		return _options;
	}


}
XldField_enumProp.prototype = Object.create(XldField.prototype); 
XldField_enumProp.prototype.constructor = XldField_enumProp;


module.exports = XldField_enumProp;