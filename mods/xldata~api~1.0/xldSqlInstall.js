var xld = require('xld.js');
var Model = require('xldModel');

xld.log('**** MODEL *****' , Model, typeof Model);

var XldSqlInstall = function() {
	Model.call(this);
	
	this.tableName('xld_sql_install');
	this.fieldAdd('modelId', 		'id');
	this.fieldAdd('modelVersion', 	'stringProp', 100);
	this.fieldAdd('versionHint', 	'textProp');
	this.fieldAdd('sqlScript',		'textProp');
};
//XldSqlInstall.prototype = Object.create(Model.prototype); 
XldSqlInstall.prototype.constructor = XldSqlInstall;





module.exports = XldSqlInstall;