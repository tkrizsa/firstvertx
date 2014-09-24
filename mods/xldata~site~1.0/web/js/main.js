
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
xld.Page = function(mainScope, ix, url, template) {
	this.mainScope 	= mainScope;
	this.ix 		= ix;
	this.url		= url;
	this.title 		= url;
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
	
	$scope.$on('$locationChangeStart', function(e, newUrl, oldUrl){
		console.log('$locationChangeStart');
		console.log($location.path());
		//console.log(a);
		console.log('oldUrl : ' + oldUrl);
		console.log('newUrl : ' + newUrl);
	});
	
	$scope.$on('$locationChangeSuccess', function(){
		console.log('$locationChangeSuccess');
		console.log($location.path());
		$scope.mainUrl = $location.path();
		if ($scope.forward) {
			$scope.forward = false;
		} else {
			for (var i in $scope.pages) {
				if ($scope.pages.hasOwnProperty(i)) {
					delete $scope.pages[i];
				}
			}
			setTimeout(function() {
				$('#xld-main-scroll').css({'left' : '0px'  });			
			},1);
			
		}
		
		var ix = ++$scope.MAX_PAGE_IX;
		$scope.pages[ix] = new xld.Page($scope, ix, $scope.mainUrl, '/templates' + ($scope.mainUrl == '/' ? '/home' : $scope.mainUrl));
		$scope.setScroll();
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
		console.log('scroll to '  + xl);
		$('#xld-main-scroll').animate({'left' : xl + 'px'  });
	}
	
	$scope.setForward = function() {
		$scope.forward = true;
	}
	
	$scope.getBrowserState = function() {
		var bs = {};
		var bs.pgs = new Array();
		var i = 0;
		for (var ix in $scope.pages) {
			if (!$scope.pages.hasOwnProperty(ix)) 
				continue;
			var page = $scope.pages[ix];
			bs.pgs.push({
				seg : 'main',
				pos : i,
				url : page.url
			});
			i++;
		}
		if (bs.pgs.length == 0)
			return '';
		else {
			var bss = $.param(bs);
			console.log('bs' + bss);
			bss = $.base64.encode(bss);
			return bss;
		}
	}

}]);


	/* =================================================== DIRECTIVES ======================================== */

	// Handles browser window resizing ... sets windowArea size
	xldApp.directive('xldWindowResize', function ($window) {
		return function (scope, element) {
			// var w = angular.element($window);
			// var head = $('#xld-nav-main');
			
			// scope.getWindowDimensions = function () {
				// return { 'h': w.height()  - head.height() , 'w': w.width() };
			// };
			// scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
				// scope.xldMainStyle = function () {
					// return {
						// /*'height': (newValue.h - 0) + 'px',
						// 'width': (newValue.w - 0) + 'px'*/
					// };
				// };
			// });
			
			// w.bind('resize', function () {
				// if (!scope.$$phase)
					// scope.$apply();
			// });
		}
	});
	
	xldApp.directive('xldScroll', function () {
		return function (scope, element) {
			element.enscroll({
				verticalTrackClass: 'xld-scroll-track',
				verticalHandleClass: 'xld-scroll-handle',
				showOnHover: true,
				minScrollbarLength: 28
			});	
		
		}
	});
	
	xldApp.directive('xldForward', function () {
		return function (scope, element) {
			element.click(function(e) {
				var _browserState = scope.getBrowserState();
				element.attr('href', '/atiradevazze?');
				scope.setForward();
			});	
		
		}
	});
	


// ======================= resume ANGULAR BOOTSTRAP ==============================
angular.element().ready(function () {
	angular.resumeBootstrap(['xldApp']);
});



