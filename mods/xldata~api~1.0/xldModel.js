var vertx = require('vertx');
var eb = vertx.eventBus;
var xld = require('xld.js');
var md5 = require('md5.js');

var XldField_id 			= require('xldField_id');
var XldField_stringProp		= require('xldField_stringProp');
var XldField_textProp 		= require('xldField_textProp');
var XldField_enumProp 		= require('xldField_enumProp');


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
	//this.installScripts	= {};
	
	
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
		//xld.log('------------------ INSTALL ' + this.modelId + ' ---------------------------');
		var vst = this.tableName() + '#';
		for (var i in this.fields)
			vst += this.fields[i].toString() + '|';
		var vcode = md5(vst);
		//xld.log(vcode);
		
		var query = "SELECT modelVersion FROM xld_sql_install WHERE modelId = '"+thisModel.modelId+"' ORDER BY installId ASC";
		eb.send('xld-sql-persist', { "action" : "raw",  "command" : query}, function(res) 	{
			if (res.status != 'ok') {
				xld.log("SQL ERROR : " + res.message);
				return;
			}
			var curVer = '';
			for (var i in res.results) {
				var row = res.results[i];
				curVer = row[0];
			}
			if (curVer != vcode) {
				var inst = thisModel.installScripts;
				var inAct = -1;
				for (var i = inst.length-1; i>=0; i--) {
					if (inst[i].modelVersion == vcode) {
						inAct = i;
						break;
					}
				}
				if (inAct<0) {
					xld.log('INSTALL REQUIRED, BUT MISSING!', 'model: '+ thisModel.modelId, 'version : ' + vcode);
					return;
				}
				var inLast = -2;
				if (curVer == '') {
					inLast = -1;
				} else {
					for (var i = inst.length-1; i>=0; i--) {
						if (inst[i].modelVersion == curVer) {
							inLast = i;
							break;
						}
					}
				}
				if (inLast<-1) {
					xld.log('INSTALL REQUIRED, BUT LAST INSTALLED VERSION MISSING!', 'model: '+ thisModel.modelId, 'version : ' + curVer);
					return;
				}
				
				xld.log('current, last', inAct, inLast);
				var queries = [];
				for (var i = inLast+1; i<=inAct; i++) {
					xld.log("INSTALLING VERSION : " + inst[i].modelVersion);
					
					queries.push(inst[i].sqlScript);
					
					var query = "INSERT INTO xld_sql_install (modelId, modelVersion, versionHint, sqlScript) ";
					query += " VALUES('"+thisModel.escape(thisModel.modelId)+"', '"+thisModel.escape(inst[i].modelVersion)+"', '"+thisModel.escape(inst[i].versionHint)+"', '"+thisModel.escape(inst[i].sqlScript)+"')";
				
					queries.push(query);
				}
				
				
					
					
				thisModel.dbUpdate(queries, function(err) {
					if (!err) {
						xld.log('INSTALL OK.');
					}
				});
				
				
				// eb.send('xld-sql-persist', { "action" : "raw",  "command" : inst[vcode].sqlScript}, function(res) 	{
					// if (res.status != 'ok') {
						// xld.log("SQL ERROR (script) : " + res.message, inst[vcode].sqlScript);
						// return;
					// }
					// var query = "INSERT INTO xld_sql_install (modelId, modelVersion, versionHint, sqlScript) ";
					// query += " VALUES('"+thisModel.escape(thisModel.modelId)+"', '"+thisModel.escape(vcode)+"', '"+thisModel.escape(inst[vcode].versionHint)+"', '"+thisModel.escape(inst[vcode].sqlScript)+"')";
					// eb.send('xld-sql-persist', { "action" : "raw",  "command" : query}, function(res) 	{
						// if (res.status != 'ok') {
							// xld.log("SQL ERROR (log) : " + res.message, query);
							// return;
						// }
						// xld.log("INSTALL OK.");
					// });
				// });
				
			}
			
		});
		
	
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
				var fn = this.fields[j].fieldName();
				rrow[fn] = row[j];
			}
			this.addLink(rrow);
			res.push(rrow);
			
		}
		return {
			rows : res
		}
	}
	
	this.addEmptyRow = function() {
		var row = [];
		for (var i in this.fields) {
			row.push(null);
		}
		this.rows.push(row);
		return row;
	}
	
	this.loadSql = function(query, func) {
		eb.send('xld-sql-persist', { "action" : "raw",  "command" : query}, function(res) 	{
			if (res.status == 'ok') {
				var fm = {}; //fieldMap
				xld.log("-----------------------------------------------");
				srow = '';
				for (var i in res.fields) {
					srow += res.fields[i] + ' | ';
					for (var j in thisModel.fields) {
						var f = thisModel.fields[j];
						if (res.fields[i] == f.fieldName())
							fm[j] = i;
					}
				}
				
				xld.log(srow, "-----------------------------------------------");
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
					for (var j in  thisModel.fields ) {
						if (fm[j]) {
							newrow.push(res.results[i][fm[j]]);
						} else {
							newrow.push(null);
						}
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
	
	this.clear = function() {
		this.rows = [];
	}
	
	this.load = function(partnerId, func) {
		this.clear();
		this.loadSql("SELECT * FROM `" + this.tableName() + "` WHERE `" + _keyName + "` = '" + partnerId + "'", function(err) {
			if (typeof func == 'function') func(err);
		});
	}

	this.loadList = function(func) {
		this.clear();
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
				var fn = this.fields[j].fieldName();
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
			var fn = this.fields[i].fieldName();
			if (fn == _keyName)	{
				kv = row[i];
				continue;
			}
				
			var val = row[i];
			if (val === null) {
				val = 'NULL';
			} else {
				val = "'" + val + "'"
			}
			sql += sep + "`"+ fn + "` = " + val + "\r\n";
			sep = ', ';
			
		}
		
		
		if (kv == null) {
			this.saveSqlRowInsert(row, func);
			return;
		
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
	
	this.saveSqlRowInsert = function(row, func) {
		var sql = ""
			+ "INSERT INTO `" + this.tableName() + "` (\r\n";
		var sep = '';
		var sqlvals = '';
		for (var i in this.fields) {
			var fn = this.fields[i].fieldName();
			if (fn == _keyName)	{
				continue;
			}
			
			var val = row[i];
			if (val === null) {
				val = 'NULL';
			} else {
				val = "'" + val + "'"
			}
			
				
			sql += sep + "`"+ fn + "`";
			sqlvals += sep + val;
			sep = ', ';
			
			
		}
		sql += "\r\n ) \r\n VALUES (\r\n" + sqlvals + "\r\n)";
		
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

// ============================================= TOOLS =========================================

XldModel.prototype.escape = function(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

XldModel.prototype.dbUpdate = function(querys, inTrans, func) {
	if (typeof querys == 'string')
		querys = [querys];
		
	if (typeof inTrans == 'function') {
		func = inTrans;
		inTrans = true;
	}

	var actions = [];
	if (inTrans) {
		actions.push({action : 'raw', command : 'BEGIN'});
	}
	for (var i in querys) {
		actions.push({
			action : 'raw',
			command : querys[i]
		});
	}
	if (inTrans) {
		actions.push({action : 'raw', command : 'COMMIT'});
	}
	
	
	var actionIx = 0;
	var runAction = function(action) {
		xld.log('==== RUNACTION ====',  action.action=='raw'?action.command:action);
		eb.send('xld-sql-persist', action, function(res) 	{
			if (res.status != 'ok') {
				
				if (action.action == 'raw' && action.command)
					vertx.fileSystem.writeFile('./../../sql/_last_failed.sql', action.command);
				//vertx.fileSystem.writeFile('./sql/_last_failed.sql', action.command);
				
				var xmessage = res.message;
				xld.log("SQL ERROR : " + res.message);
				if (inTrans) {
					eb.send('xld-sql-persist', {action : 'raw', command : 'ROLLBACK'}, function(res) 	{
						if (res.status != 'ok') {
							xld.log('ROLLBACK FAILED!', res.message);
						} else {
							xld.log('ROLLBACK OK.');
						}
						func(xmessage);
					});
				}
			} else {
				xld.log('OK.');
				if (actionIx<actions.length-1) {
					actionIx++;
					runAction(actions[actionIx]);
				} else {
					func();
				}
			}
		});
	}
	runAction(actions[actionIx]);
}



/*Elem.prototype.extend = function(obj) {
	for(var e in Elem) {
		if (Elem.hasOwnProperty(e)) {
			obj[e] = Elem[e];
		
		}
	}
}*/


module.exports = XldModel;