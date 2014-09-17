var xld = require('xld.js');
var Partner = require('partner.js');

xld.log('XLD API Partner started ...');





xld.api('/api/partner/:partnerId', function(req, replier) {
	var p = new Partner();
	p.load(req.params.partnerId, function(err) {
		if (err) {
			replier(err);
		} else {
			replier({body : JSON.stringify(p.get())});
		}
	});
});
