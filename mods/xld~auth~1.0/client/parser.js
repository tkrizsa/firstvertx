//@xld-parser
$scope.urlParsers.push(function(url, urla) {
		
	if (urla[0] == 'actors' && urla[1]) {
		return {
			url 		: url,
			template 	: '/templates/actor',
			params 		: {
				actorId : urla[1]
			}
		}
	
	} else if (
		url == '/actors' 				||
		url == '/actors/new' 			||
		false) 
	{
		return {
			url 	 : url,
			template : '/templates' + url
		}
	}
	
});

