var xld = require('xld.js');
var Model = require('xldModel');


var CredentEmail = function() {
	Model.call(this);
	
	
	this.modelId = 'auth.credent.email';
	this.tableName('auth.credent.email');
	this.fieldAdd('credentId', 'id');
	this.fieldAdd('email', 'stringProp', 250);
	this.fieldAdd('password', 'stringProp', 32);

	
};
CredentEmail.prototype = Object.create(Model.prototype); 
CredentEmail.prototype.constructor = CredentEmail;





module.exports = CredentEmail;