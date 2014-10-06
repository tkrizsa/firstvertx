var xld = require('xld.js');
var Model = require('xldModel');


var Actor_x_CredentEmail = function() {
	Model.call(this);
	
	
	this.modelId = 'auth.actor._x_.credent.email';
	this.tableName('auth.actor._x_.credent.email');
	this.fieldAdd('aceId', 'id');
	this.fieldAdd('actorId', 'master', {'modelId' : 'auth.actor'});
	this.fieldAdd('credentEmailId', 'master', {'modelId' : 'auth.credent.email'});

	
};
Actor_x_CredentEmail.prototype = Object.create(Model.prototype); 
Actor_x_CredentEmail.prototype.constructor = Actor_x_CredentEmail;





module.exports = Actor_x_CredentEmail;