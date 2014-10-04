//@xld-controller : actors

xldApp.__controllerProvider.register('xldCtrlActors', ['$scope', function ($scope) {
	var pg = $scope.page.init($scope);
	$scope.page.getStruct('actors', '/api/actors');
	

	$scope.$on("refresh", function (event, things) {
		things.on('Actor', function() {
			$scope.s.actors.reload()}
		);
	});
	
}]);