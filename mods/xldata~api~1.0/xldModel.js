var vertx = require('vertx');
var eb = vertx.eventBus;
var xld = require('xld.js');

var XldField_id 			= require('xldField_id');
var XldField_stringProp		= require('xldField_stringProp');
var XldField_textProp 		= require('xldField_textProp');
var XldField_enumProp 		= require('xldField_enumProp');

var SqlInstall = require('xldSqlInstall');

var global = this;

var XldModel = function() {

	var thisModel = this;

	var vertx = require('vertx');
	var console = require('vertx/console');
	
	var _tableName 		= 'table';
	var _keyName		= 'id';

	this.modelId		= 'model';
	this.fields 		= new Array();
	this.rows 			= new Array();
	
	
	/* ================================================== DDL ===================================================== */
	this.tableName = function(x) {
		if (typeof x == 'string')
			_tableName = x;
		return _tableName;
	}
	
	this.fieldAdd = function(fieldName, fieldType, fieldParam1, fieldParam2) {
		var f = false;
		if (typeof fieldName == 'object') {
			f = fieldName;
		} else {
			fc = 'XldField_' + fieldType;
			if (typeof global[fc] != 'function')
				throw "Unknown fieldType '"+ fieldType +"'.";
			f = new global[fc](fieldName, fieldParam1, fieldParam2);
		
		}
		this.fields.push(f);
		if (f.isKey())
			_keyName = f.fieldName();
	}
	
	this.install = function() {
		xld.log('------------------ INSTALL ' + this.modelId + ' ---------------------------');
		var vst = this.tableName() + '#';
		for (var i in this.fields)
			vst += this.fields[i].toString() + '|';
		xld.log(vst);
		
	
	}
	
	

	/* ================================================== DATA ===================================================== */
	this.get2 = function() {
		return {
			fields : this.fields,
			rows : this.rows
		}
	}
	
	this.get = function() {
		var res = [];
		for (var i in this.rows) {
			var row = this.rows[i];
			rrow = {};
			for (var j in this.fields) {
				var fn = this.fields[j];
				rrow[fn] = row[j];
			}
			this.addLink(rrow);
			res.push(rrow);
			
		}
		return {
			rows : res
		}
	}
	
	this.loadSql = function(query, func) {
		eb.send('xld-sql-persist', { "action" : "raw",  "command" : query}, function(res) 	{
			if (res.status == 'ok') {
				thisModel.fields = [];
				xld.log("-----------------------------------------------");
				srow = '';
				for (var i in res.fields) {
					thisModel.fields.push(res.fields[i]);
					srow += res.fields[i] + ' | ';
				}
				xld.log(srow);
				xld.log("-----------------------------------------------");
				for (var i in res.results) {
					var srow = '';
					for (var j in res.results[i]) {
						srow += res.results[i][j] + ' | ';
					}
					xld.log(srow);
				}
				xld.log("-----------------------------------------------");
				
				
				for (var i in res.results) {
					var newrow = new Array();
					for (var j in res.results[i]) {
						newrow.push(res.results[i][j]);
					}
					thisModel.rows.push(newrow);
				}
				
				if (typeof func == 'function') {
					func();
				}
				
			} else {
				xld.log("SQL ERROR : " + res.message);
				if (typeof func == 'function') {
					func(res.message);
				}
			}
		});
	}
	
	this.load = function(partnerId, func) {
		this.loadSql("SELECT * FROM `" + this.tableName() + "` WHERE `" + _keyName + "` = '" + partnerId + "'", function(err) {
			if (typeof func == 'function') func(err);
		});
	}

	this.loadList = function(func) {
		this.loadSql("SELECT * FROM `"+ this.tableName() +"` ", function(err) {
			if (typeof func == 'function') func(err);
		});
	}
	
	
	
	this.loadPost = function(body) {
		body = JSON.parse(body);
			
		this.rows = [];
		for(var i in body.rows) {
			xld.log('================================ POST ROW ============================================');
			var brow = body.rows[i];
			var row = {};
			for (var j in this.fields) {
				var fn = this.fields[j];
				row[j] = brow[fn];
			}
			this.rows.push(row);
		}
	}
	
	this.saveSql = function(func) {
		var rc = 0;
		var serr;
		for (var i in this.rows) {
			rc++;
			this.saveSqlRow(this.rows[i], function(err) {
				if (err) {
					if (typeof serr == 'undefined')
						serr = '';
					serr += '\r\n' + err;
				}
				rc--;
				if (typeof func == 'function' && rc == 0) {
					func(serr);
				}
			});
		}
	}
	
	this.saveSqlRow = function(row, func) {
		var sql = ""
			+ "UPDATE `" + this.tableName() + "`\r\n"
			+ "SET\r\n";
		var kv = '';
		var sep = '';
		for (var i in this.fields) {
			var fn = this.fields[i];
			if (fn == _keyName)	{
				kv = row[i];
				continue;
			}
				
			sql += sep + "`"+ this.fields[i] + "` = '" + row[i] + "'\r\n";
			sep = ', ';
			
		}
		sql += "WHERE `" + _keyName + "` = '" + kv + "'";
		console.log(sql);
		eb.send('xld-sql-persist', { "action" : "raw",  "command" : sql}, function(res) 	{
			if (res.status == 'ok') {
				if (typeof func == 'function') 
					func();
			} else {
				xld.log("SQL ERROR : " + res.message);
				if (typeof func == 'function') 
					func(res.message);
			}
		});
	
	}
	

}


XldModel.prototype.addLink = function(row) {
}


/*Elem.prototype.extend = function(obj) {
	for(var e in Elem) {
		if (Elem.hasOwnProperty(e)) {
			obj[e] = Elem[e];
		
		}
	}
}*/


module.exports = XldModel;