var vertx = require('vertx');
var eb = vertx.eventBus;
var xld = require('xld.js');

var Elem = function() {

	var thisElem = this;

	var vertx = require('vertx');
	var console = require('vertx/console');

	this.fields 		= new Array();
	this.rows 			= new Array();
	this.tableName 		= 'table';
	this.keyName 		= 'id';

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
				thisElem.fields = [];
				xld.log("-----------------------------------------------");
				srow = '';
				for (var i in res.fields) {
					thisElem.fields.push(res.fields[i]);
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
					thisElem.rows.push(newrow);
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
			+ "UPDATE `" + this.tableName + "`\r\n"
			+ "SET\r\n";
		var kv = '';
		var sep = '';
		for (var i in this.fields) {
			var fn = this.fields[i];
			if (fn == this.keyName)	{
				kv = row[i];
				continue;
			}
				
			sql += sep + "`"+ this.fields[i] + "` = '" + row[i] + "'\r\n";
			sep = ', ';
			
		}
		sql += "WHERE `" + this.keyName + "` = '" + kv + "'";
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

/*Elem.prototype.extend = function(obj) {
	for(var e in Elem) {
		if (Elem.hasOwnProperty(e)) {
			obj[e] = Elem[e];
		
		}
	}
}*/


module.exports = Elem;