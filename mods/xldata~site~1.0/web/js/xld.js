var xld = xld || {};


xld.getStruct = function (page, url) {
	var s = new xld.Struct(this, url);
	return s;
}


xld.Struct = function(owner, url) {
	this._owner = owner;
	this._url = url;
	this._rows = false;

	var _thans = [];
	var _errs = [];
	
	
	var thisStruct = this;
	
	$.get(url, function(resp) {
		/*var fields = thisStruct._fields = resp.fields;
		
		thisStruct._rows = [];
		$.each(resp.rows, function(j, rowa) {
			var row  = {};
			for (var i in fields) {
				row[fields[i]] = rowa[i];
			}
			thisStruct._rows.push(row);
		});

		if (thisStruct._rows.length > 0) {
			for (var i in fields) {
				thisStruct[fields[i]] = thisStruct._rows[0][fields[i]];
			}
		}*/
	
		thisStruct._rows = resp.rows;
		if (thisStruct._rows.length>0) {
			$.each(thisStruct._rows[0], function(fn, val) {
				thisStruct[fn] = val;
			});
		
		}
	
	
		$.each(_thans, function(i, func) {
			var ret = func(thisStruct);
		});
	});
	
	this.than = function(func) {
		_thans.push(func);
		return this;
	}
	
	this.err = function(func) {
		_errs.push(func);
		return this;
	}
	
	this.save = function(func) {
		$.post(this._url, JSON.stringify({rows : this._rows}), function(resp) {
			if (typeof func == 'function') {
				func();
			}
		});
	
	}
}