//@xld-controller : AuthUsers

xldApp.__controllerProvider.register('xldCtrlAuthUsers', ['$scope', function ($scope) {
	var pg = $scope.page.init($scope);
	$scope.page.getStruct('users', '/api/auth.actors');
	

	$scope.$on("refresh", function (event, things) {
		things.on('User', function() {
			$scope.s.users.reload()}
		);
	});
	
}]);