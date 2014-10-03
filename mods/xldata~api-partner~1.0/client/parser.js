//@xld-parser
$scope.urlParsers.push(function(url, urla) {		
		

	if (urla[0] == 'partners' && urla[1]) {
		return {
			url 		: url,
			template 	: '/templates/partner',
			params 		: {
				partnerId : urla[1]
			}
		}
	
	} 
	return {
		url 	 : url,
		template : '/templates' + (url == '/' || url == '' ? '/home' : url)
	}
	
});

