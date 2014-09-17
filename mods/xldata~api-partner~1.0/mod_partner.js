var xld = require('xld.js');
var partner = require('partner.js');

xld.log('XLD API Partner started ...');





xld.api('/partner/:partnerId', function(req, replier) {
	xld.log('APIII event!');
	replier(partner.get());
});
