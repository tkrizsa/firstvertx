var xld = require('xld.js');
var Model = require('xldModel');


var Actor = function() {
	Model.call(this);
	
	
	this.modelId = 'auth.actor';
	this.tableName('auth.actor');
	
	this.fieldAdd('actorId', 'id');
	this.fieldAdd('actorName', 'stringProp', 100);
	
	this.addExpandNN('auth.credent.email', 'auth.actor._x_.credent.email', 'auth.credent.email');

	// must override to add a "user" link
	this.addLink = function(row) {
		var kv = row[this.getKeyName()];
		kv = kv == null ? 'new' : kv;
		Model.prototype.addLink.call(this, row);
		row.user_gui = {
			href : '/users/' + kv
		}
	}
	
	
};
Actor.prototype = Object.create(Model.prototype); 
Actor.prototype.constructor = Actor;





module.exports = Actor;