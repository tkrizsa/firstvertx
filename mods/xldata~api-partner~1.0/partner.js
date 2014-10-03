var xld = require('xld.js');
var Model = require('xldModel');


var Partner = function() {
	Model.call(this);
	
	this.modelId = 'partner';
	this.tableName('partner');
	this.fieldAdd('partnerId', 'id');
	this.fieldAdd('partnerName', 'stringProp', 100);
	this.fieldAdd('partnerStatus', 'enumProp', ['programmer', 'customer']);
	this.fieldAdd('address1', 'stringProp', 200);
	
};
Partner.prototype = Object.create(Model.prototype); 
Partner.prototype.constructor = Partner;


Partner.prototype.addLink = function(row) {
	row.self = {
		href : '/api/partner/' + row.partnerId
	}
	row.gui = {
		href : '/partners/' + row.partnerId
	}
}


Partner.prototype.installScripts = [
	{
	modelVersion	: 'f69e50d364352fac4132316f215d4ef6',
	versionHint 	: 'initial',
	sqlScript		: ''
		+ "CREATE TABLE `partner` (\r\n"
		+ " `partnerId` INT AUTO_INCREMENT,\r\n"
		+ " `partnerName` VARCHAR(100),\r\n"
		+ " PRIMARY KEY(`partnerId`)\r\n"
		+ ")\r\n"
	},
	{

	modelVersion 	: '1e9f1d6d3549d260208e951331cae38c',
	versionHint 	: 'add column partnerStatus',
	sqlScript		: ''
		+ "ALTER TABLE `partner`\r\n"
		+ "ADD  `partnerStatus` ENUM('programmer','customer','stranger')\r\n"
	},
	{

	modelVersion 	: 'ec3e752f3ee7f6d1afecb294ea711b1e',
	versionHint 	: 'add column address1',
	sqlScript		: ''
		+ "ALTER TABLE `partner`\r\n"
		+ "ADD  `address1` VARCHAR(200)\r\n"
	},
	{

	modelVersion 	: 'e44a439a6c6c8430941028272b9178c2',
	versionHint 	: 'set fields to not null',
	sqlScript		: ''
		+ "ALTER TABLE `partner`\r\n"
		+ "MODIFY `partnerId` INT NOT NULL AUTO_INCREMENT,\r\n"
		+ "MODIFY `partnerName` VARCHAR(100) NOT NULL ,\r\n"
		+ "MODIFY `partnerStatus` ENUM('programmer','customer','stranger') NOT NULL \r\n"
	 
	}

];


module.exports = Partner;