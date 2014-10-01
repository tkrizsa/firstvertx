var XldField = require('XldField');


XldField_txtProp = function(fieldName, size) {
	XldField.call(this, fieldName);
	
	var _size = parseInt(size);
	
	this.size = function(x) {
		if (parseInt(x) > 0)
			_size = x;
		return size;
	}


}
XldField_txtProp.prototype = Object.create(XldField.prototype); 
XldField_txtProp.prototype.constructor = XldField_txtProp;


module.exports = XldField_txtProp;