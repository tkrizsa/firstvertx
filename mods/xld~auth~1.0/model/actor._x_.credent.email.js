var xld = require('xld.js');
var Model = require('xldModel');


var Actor_x_CredentEmail = function() {
	Model.call(this);
	
	
	this.modelId = 'actor._x_.credent.email';
	this.tableName('actor_x_CredentEmail');
	this.fieldAdd('aceId', 'id');
	this.fieldAdd('actorId', 'reference', {'modelId' : 'actor'});
	this.fieldAdd('credentEmailId', 'reference', {'modelId' : 'credent.email'});

	
};
Actor_x_CredentEmail.prototype = Object.create(Model.prototype); 
Actor_x_CredentEmail.prototype.constructor = Actor_x_CredentEmail;





module.exports = Actor_x_CredentEmail;