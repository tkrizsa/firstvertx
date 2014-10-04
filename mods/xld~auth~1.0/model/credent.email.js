var xld = require('xld.js');
var Model = require('xldModel');


var CredentEmail = function() {
	Model.call(this);
	
	
	this.modelId = 'credent.email';
	this.tableName('credentEmail');
	this.fieldAdd('credentId', 'id');
	this.fieldAdd('email', 'stringProp', 250);
	this.fieldAdd('password', 'stringProp', 32);

	
};
CredentEmail.prototype = Object.create(Model.prototype); 
CredentEmail.prototype.constructor = CredentEmail;





module.exports = CredentEmail;