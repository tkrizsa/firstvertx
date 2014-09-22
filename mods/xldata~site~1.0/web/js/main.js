
$(function() {
	// $.get('/api/partner/1', function(resp) {
		// $('body').append(resp);
	// });
});



// ======================= config ANGULAR ==============================
var xldApp = angular.module('xldApp', []);

xldApp.config(function ($controllerProvider, $sceProvider, $locationProvider) {
	$sceProvider.enabled(false);
	xldApp.__controllerProvider = $controllerProvider;
	
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');
});

// ======================= xld PAGE Framework ==============================
var xld = xld || {};
xld.Page = function(mainScope, ix, title, template) {
	this.mainScope 	= mainScope;
	this.ix 		= ix;
	this.title 		= title;
	this.template 	= template;
	
	
	this.close = function() {
		console.log(this.mainScope);
		console.log(this.ix);
		delete this.mainScope.pages[this.ix];
		
		var $scope = this.mainScope;
		setTimeout(function() {
			$scope.$apply(function() {
				$scope.setScroll();
			});
		});
		
	
	};
	
	this.templateLoaded = function() {
		this.mainScope.setScroll();
	}
}

xldApp.controller('xldMain', ['$scope', '$location', function ($scope, $location) {

	$scope.MAX_PAGE_IX = -1;
	
	$scope.$on('$locationChangeSuccess', function(){
		console.log('$locationChangeSuccess');
		console.log($location.path());
		$scope.mainUrl = $location.path();
		var ix = ++$scope.MAX_PAGE_IX;
		$scope.pages[ix] = new xld.Page($scope, ix, $scope.mainUrl, '/templates' + ($scope.mainUrl == '/' ? '/home' : $scope.mainUrl));
		//$scope.setScroll();
	});

	$scope.pages = {};
	
	$scope.setScroll = function() {
		var sumWidth = 0;
		$('#xld-main-scroll').find('.xld-page-col').each(function() {
			sumWidth += $(this).width();
		});
		var mainWidth = $('#xld-main').width();
		var xl = 0;
		if (mainWidth < sumWidth)
			xl = mainWidth - sumWidth;
		console.log('scroll to ' );
		console.log(xl);
		$('#xld-main-scroll').animate({'left' : xl + 'px'  });
	}

}]);


	/* =================================================== DIRECTIVES ======================================== */

	// Handles browser window resizing ... sets windowArea size
	xldApp.directive('xldWindowResize', function ($window) {
		return function (scope, element) {
			var w = angular.element($window);
			var head = $('#xld-nav-main');
			
			scope.getWindowDimensions = function () {
				return { 'h': w.height()  - head.height() , 'w': w.width() };
			};
			scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
				scope.xldMainStyle = function () {
					return {
						/*'height': (newValue.h - 0) + 'px',
						'width': (newValue.w - 0) + 'px'*/
					};
				};
			});
			
			w.bind('resize', function () {
				if (!scope.$$phase)
					scope.$apply();
			});
		}
	});
	


// ======================= resume ANGULAR BOOTSTRAP ==============================
angular.element().ready(function () {
	angular.resumeBootstrap(['xldApp']);
});



