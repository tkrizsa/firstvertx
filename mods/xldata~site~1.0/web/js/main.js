
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
	
	this.colsOpt 	= 1;
	this.colsMin	= 1;
	this.colsMax	= 1;
	this.widthSet	= false;
	
	
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

xldApp.controller('xldMain', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {

	$scope.MAX_PAGE_IX = -1;
	$scope.dims = {};
	$scope.pages = {};
	
	
	$scope.$on('$locationChangeStart', function(e, newUrl, oldUrl){
		// console.log('$locationChangeStart');
		// console.log($location.path());
		// console.log('oldUrl : ' + oldUrl);
		// console.log('newUrl : ' + newUrl);
	});
	
	$scope.$on('$locationChangeSuccess', function(){
		console.log('$locationChangeSuccess');
		console.log($location.path());
		$scope.mainUrl = $location.path();
		var search = $location.search();
		var bs = {pgs : []};
		if (search._bs) {
			bs = $.base64.decode(search._bs);
			bs = JSON.parse(bs);
		}
		
		bs.pgs.push({
				seg : 'main',
				pos : bs.pgs.length,
				url : $scope.mainUrl
		});
		
		
		console.log(bs);
		// $scope.clearPages();
	
		
		var j = 0;
		var last_ok_bs = -1;
		var ok = true;
		for( var i in $scope.pages) {
			var a = $scope.pages[i];
			if (ok && bs.pgs[j]) {
				var b = bs.pgs[j];
				if (a.url == b.url) {
					last_ok_bs = j;
					j++;
					continue;
				}
			}

			ok = false;
			delete $scope.pages[i];
		}
		

		

		for (var i in bs.pgs) {
			if (i<=last_ok_bs)
				continue;
			var p = bs.pgs[i];
			
			var ix = ++$scope.MAX_PAGE_IX;
			$scope.pages[ix] = new xld.Page($scope, ix, p.url, '/templates' + (p.url == '/' || p.url == '' ? '/home' : p.url));
			
		}
		$timeout(function() {
			$scope.setScroll();
		},1);
		
	});

	
	$scope.clearPages = function() {
		for (var i in $scope.pages) {
			if ($scope.pages.hasOwnProperty(i)) {
				//$('#xld-page-' + $scope.pages[i].ix).hide();
				delete $scope.pages[i];
			}
		}
		$('#xld-main-scroll').css({'left' : '0px'  });			
		$scope.MAX_PAGE_IX = -1;
	};
	
	$scope.resetDims = function() {
		this.dims.mainWidthPx 		= $('#xld-main').width();
		this.dims.emSize 			= parseFloat($("body").css("font-size"));
		this.dims.mainWidthEm 		= this.dims.mainWidthPx / this.dims.emSize;
		this.dims.mainColCount 		= Math.floor(this.dims.mainWidthEm / 20);
		this.dims.colWidthPx 		= Math.floor(this.dims.mainWidthPx / this.dims.mainColCount);
	}
	
	$scope.resetDims();
	
	$scope.getMaxWidth = function() {
		return $scope.dims.mainWidthPx + 'px';
	}
	
	$scope.setScroll = function(beforeApply) {
		if ($scope.pages.length<=0) {
			$('#xld-main-scroll').css({'left' : '0px'  });
			return;
		}
	
		$scope.resetDims();

		
		var ps = new Array();
		for (var i in $scope.pages) {
			ps.push($scope.pages[i]);
		}
		ps = ps.reverse();
		var colsLeft = $scope.dims.mainColCount;
		for (var i in ps) {
			var p = ps[i];
			if (colsLeft >= p.colsOpt)
				p.colsAkt = p.colsOpt;
			else  
				p.colsAkt = colsLeft;
			if (p.colsAkt <= 0)
				p.colsAkt = 1;
			colsLeft -= p.colsAkt;
		}
		if (colsLeft > 0) {
			ps[0].colsAkt += colsLeft;
			/*var cc = Math.ceil(colsLeft / ps.length);
			for (var i in ps) {
				if (cc <= colsLeft) {
					ps[i].colsAkt += cc;
					colsLeft -= cc;
				} else {
					ps[i].colsAkt += colsLeft;
					break;
				}
			}
			*/
		}
	
		for (var i in ps) {
			var xw = (ps[i].colsAkt * $scope.dims.colWidthPx) + 'px';
			if (beforeApply) {
				
			} else {
				$('#xld-page-' + ps[i].ix).stop(true).animate({'width' : xw});
			}
		}
	
		
		var xl = 0;
		if (colsLeft < 0)
			xl = colsLeft * $scope.dims.colWidthPx;
			
		if (!beforeApply) {
			console.log('scroll to '  + xl);
			$('#xld-main-scroll').stop(true).animate({'left' : xl + 'px'  });
		}
	}
	
	$scope.setForward = function() {
		$scope.forward = true;
	}
	
	$scope.getBrowserState = function() {
		var bs = {};
		bs.pgs = new Array();
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
			return $.base64.encode(JSON.stringify(bs));;
		}
	}

}]);


	/* =================================================== DIRECTIVES ======================================== */

	// Handles browser window resizing ... sets windowArea size
	xldApp.directive('xldWindowResize', function ($window) {
		return function (scope, element) {
			var w = angular.element($window);
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
			
			w.bind('resize', function () {
				console.log('resize...');
				if (!scope.$$phase)
					scope.$apply(function() {
						scope.setScroll();
					});
			});
		}
	});
	
	xldApp.directive('xldScroll', function () {
		return function (scope, element) {
			/*element.enscroll({
				verticalTrackClass: 'xld-scroll-track',
				verticalHandleClass: 'xld-scroll-handle',
				showOnHover: true,
				minScrollbarLength: 28
			});	*/
		
		}
	});
	
	xldApp.directive('xldForward', function () {
		return function (scope, element) {
			element.click(function(e) {
				var _bs = scope.getBrowserState();
				var oldHref = element.attr('href');
				var newHref = oldHref;
				if (_bs != '')
					newHref = xld.addParameter(oldHref, '_bs', _bs);
				element.attr('href', newHref);
				//scope.setForward();
			});	
		
		}
	});
	
	xldApp.directive('xldPage', function () {
		return function (scope, element, attrs) {
			console.log('===PAGE===');
			var a = attrs['xldPage'].split(',');
			scope.page.colsOpt = parseInt(a[0]);
			scope.page.colsMin = parseInt(a[1]);
			scope.page.colsMax = parseInt(a[2]);
			scope.setScroll();
		}
	});
	
	xldApp.filter('pageSort', function () {
		return function (arrInput) {

			var s = new Array();
			for (var w in arrInput) {
				if (!arrInput.hasOwnProperty(w))
					continue;
				s.push(arrInput[w]);
			}

			var arr = s.sort(function (a, b) {
				if (a.ix > b.ix) { return 1; }
				if (a.ix < b.ix) { return -1; }
				return 0;
			});
			return arr;
		}
	});


// ======================= resume ANGULAR BOOTSTRAP ==============================
angular.element().ready(function () {
	angular.resumeBootstrap(['xldApp']);
});



