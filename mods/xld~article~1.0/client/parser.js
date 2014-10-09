//@xld-parser
//@xld-parser-name:hello faszom asédlkfj   
xld.mainScope.urlParsers.push(function(url, urla) {		
	/*if (urla[0] == 'partners' && urla[1]) {
		return {
			url 		: url,
			template 	: '/templates/partner',
			params 		: {
				partnerId : urla[1]
			}
		}
	
	} else*/ if (
		url == '/articles' 						||
		false) 
	{
		return {
			url 	 : url,
			template : '/templates' + url
		}
	}
	
});

