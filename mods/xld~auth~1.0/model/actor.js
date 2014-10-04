var xld = require('xld.js');
var Model = require('xldModel');


var Actor = function() {
	Model.call(this);
	
	
	this.modelId = 'actor';
	this.tableName('actor');
	this.fieldAdd('actorId', 'id');
	this.fieldAdd('actorName', 'stringProp', 100);

	
};
Actor.prototype = Object.create(Model.prototype); 
Actor.prototype.constructor = Actor;





module.exports = Actor;