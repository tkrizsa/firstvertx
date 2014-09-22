var xld = require('xld.js');
var Partner = require('partner.js');

xld.log('XLD API Partner started ...');





xld.api('/api/partner/:partnerId', function(req, replier) {
	var p = new Partner();
	p.load(req.params.partnerId, function(err) {
		if (err) {
			replier(err);
		} else {
			replier(p.get(), 'partner');
		}
	});
});





xld.template('home');
xld.template('partners');
xld.template('partners_1');
xld.template('partners_2');
xld.template('about');