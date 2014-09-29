$scope.urlParsers.push(function(url, urla) {		
		

	if (urla[0] == 'partners' && parseInt(urla[1]) > 0) {
		return {
			url 		: url,
			template 	: '/templates/partner',
			params 		: {
				partnerId : parseInt(urla[1])
			}
		}
	
	} 
	return {
		url 	 : url,
		template : '/templates' + (url == '/' || url == '' ? '/home' : url)
	}
	
});