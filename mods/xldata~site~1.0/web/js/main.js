
$(function() {
	$.get('/api/partner/1', function(resp) {
		$('body').append(resp);
	
	});

});