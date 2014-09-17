var xld = require('xld.js');
var Partner = require('partner.js');

xld.log('XLD API Partner started ...');





xld.api('/partner/:partnerId', function(req, replier) {
	var p = new Partner();
	p.load(req.params.partnerId);
	replier(p.get());
});
