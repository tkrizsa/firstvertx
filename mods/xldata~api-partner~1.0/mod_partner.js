var vertx = require('vertx');
var xld = require('xld.js');
var Partner = require('partner.js');

xld.moduleName='partner';
xld.log('XLD API Partner started ...');






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
	
	p.loadPost(req.body);
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
		var mf = {
			'urlParsers' 	: [],
			'templates' 	: [],
			'controllers'   : []
		};
		
		for (var i = 0; i < res.length; i++) {
			var f = res[i];
			vertx.fileSystem.readFile(f, function(err, res) {
				if (!err) {
					
					var x = res.toString();
					var ct = 'text/plain';
					var file = f.split('/').slice(-1)[0].slice('.')[0];
					var ext = f.split('.').slice(-1)[0];
				
					switch (ext) {
						case 'html' 	: ct = 'text/html';
						break;
						case 'css' 		: ct = 'text/css';
						break;
						case 'js' 		: ct = 'text/javascript';
						break;
					
					}
				
					mf['templates'].push({
						body : x
					});
					
				} else {
					xld.log(err); 
					serr += err + '\r\n';
				}
				fc --;
				if (fc <= 0) {
					if (serr) {
						replier({body : '500 cannot read file\r\n'+serr, status : 500});					
					} else {
						replier({body : JSON.stringify(mf), contentType : ct});
					}
				}
			});
		}
	});



	// vertx.fileSystem.readFile('client/' + f, function(err, res) {
		// if (!err) {
			// var x = res.toString();
			// var ct = 'text/plain';
			// var ext = f.split('.').slice(-1)[0];
			
			// switch (ext) {
				// case 'html' 	: ct = 'text/html';
				// break;
				// case 'css' 		: ct = 'text/css';
				// break;
				// case 'js' 		: ct = 'text/javascript';
				// break;
			
			// }
			
			// replier({body : x, contentType : ct});
		// } else {
			// replier({body : '404 not found', status : 404});
		// }
	// });

});
