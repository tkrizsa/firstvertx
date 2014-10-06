//@xld-controller : AuthUser

xldApp.__controllerProvider.register('xldCtrlAuthUser', ['$scope', '$window', function ($scope, $window) {
	var pg = $scope.page.init($scope);
	var s  = pg.structs;
	$scope.page.getStructOne('users', 'user', '/api/auth.actors/'+pg.params.userId+'?_expand=auth.credent.email').than(function() {
		s.user['auth.credent.email'].push(s.users.templates['auth.credent.email']);
	});
	$scope.save = function() {
		debugger;
		$scope.s.users.save(function() {
			$window.history.back();
			$scope.broadcastRefresh('User');
		});
	}
}]);

