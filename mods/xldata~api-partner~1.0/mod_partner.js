var vertx = require('vertx');
var xld = require('xld.js');
var Partner = require('partner.js');

xld.moduleName='partner';
xld.log('XLD API Partner started ...');



var xp = new Partner();
xp.checkDataBase();


xld.api('/api/partners', function(req, replier) {
	var p = new Partner();
	p.loadList(function(err) {
		if (err) {
			replier(err);
		} else {
			replier(p.get());
		}
	});
});


xld.api('/api/partners/:partnerId', function(req, replier) {
	var p = new Partner();
	p.load(req.params.partnerId, function(err) {
		if (err) {
			replier(err);
		} else {
			replier(p.get());
		}
	});
});

xld.apiPost('/api/partners/:partnerId', function(req, replier) {
	var p = new Partner();
	xld.log('/=========================POOOOST=====================================', req.body);
	p.loadPost(req);
	p.saveSql(function(err) {
		if (err) {
			replier(err);
		} else {
			replier(p.get());
		}
	});
});



xld.template('home');
xld.template('partners');
xld.template('partner', 'partners/:partnerId');
xld.template('about');

xld.http('/module/partner', function(req, replier) {
	vertx.fileSystem.readDir('client/', function(err, res) {
		if (err) {
			xld.log(err); 
			replier({body : '500 cannot read dir', status : 500});
			return;
		}
		var fc = res.length;
		var serr = '';
		var mf = [];
		
		var myReadFile = function(f, func) {
			vertx.fileSystem.readFile(f, function(err, res) {
				func(err, res, f);
			});
		}
		
		for (var i = 0; i < res.length; i++) {
			var f = res[i];
			myReadFile(f, function(err, res, f) {
				if (!err) {
					
					var x = res.toString();
					var file = (f.split(xld.PATH_DELIMITER).slice(-1)[0]);
					file = file.split('.')[0];
					
					var ext = f.split('.').slice(-1)[0];
					xld.log("====>", f, typeof file, file, ext);
					switch (ext) {
						case 'html' :
							mf.push({
								kind : 'template',
								templateName : '/templates/'+file,
								module : xld.moduleName,
								body : x
							});
						break;
						case 'js' :	
							mf.push({
								kind : 'parser',
								module : xld.moduleName,
								body : x
							});
						break;
					
					}
				
				} else {
					xld.log(err); 
					serr += err + '\r\n';
				}
				fc --;
				if (fc <= 0) {
					if (serr) {
						replier({body : '500 cannot read file\r\n'+serr, status : 500});					
					} else {
						replier({body : JSON.stringify(mf), contentType : 'application/json'});
					}
				}
			});
		}
	});
	
	
});
