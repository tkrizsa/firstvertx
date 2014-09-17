var vertx = require('vertx');

var xld = require('xld.js');

xld.log('XLD site started ......');






var fileLoader = function(req, replier) {
	var f = 'index.html';
	if (req.path && req.path != '/')
		f = req.path;
	xld.log('file:');
	xld.log(f);
	vertx.fileSystem.readFile('web/'+f, function(err, res) {
		if (!err) {
			var x = res.toString();
			replier({body : x});
		} else {
			replier({body : '404 not found', status : 404});
		}
	});
};




xld.api('/', fileLoader);
xld.api('/css/:file', fileLoader);
xld.api('/js/:file', fileLoader);
xld.api('/js/vendor/:file', fileLoader);


