var xld = require('xld.js');
var Partner = require('partner.js');

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
// xld.template('partners_1');
// xld.template('partners_2');
// xld.template('partners_3');
xld.template('partner', 'partners/:partnerId');
xld.template('about');