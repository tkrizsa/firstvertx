var xld = require('xld.js');
var Partner = require('flowpartner.js');

xld.log('XLD API FlowPartner started ...');





xld.api('/partner/:partnerId', function(req, replier) {
	var p = new Partner();
	p.load(req.params.partnerId);
	replier(p.get());
});