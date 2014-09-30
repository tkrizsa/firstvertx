//@xld-controller : partners
debugger;
xldApp.__controllerProvider.register('xldCtrlPartners', ['$scope', function ($scope) {
	var pg = $scope.page.init($scope);
	$scope.page.getStruct('partners', '/api/partners')
	.than(function(resp) {
		console.log(resp);
		console.log($scope.s);
	});
	
}]);