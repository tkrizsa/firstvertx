
$(function() {
	$.get('/api/partner/1', function(resp) {
		$('body').append(resp);
	});


	// ======================= config History ==============================
	var History = window.History;
	if (History.enabled) {
		State = History.getState();
		// set initial state to first page that was loaded
		History.pushState({urlPath: window.location.pathname}, $("title").text(), State.urlPath);
	} else {
		return false;
	}

	var loadAjaxContent = function(target, urlBase, selector) {
		$(target).load(urlBase + ' ' + selector);
	};

	var updateContent = function(State) {
		console.log('state:');
		console.log(state);
		var selector = '#' + State.data.urlPath.substring(1);
		if ($(selector).length) { //content is already in #hidden_content
			$('#content').children().appendTo('#hidden_content');
			$(selector).appendTo('#content');
		} else { 
			$('#content').children().clone().appendTo('#hidden_content');
			loadAjaxContent('#content', State.url, selector);
		}
	};

	// Content update and back/forward button handler
	History.Adapter.bind(window, 'statechange', function() {
		updateContent(History.getState());
	});

	// navigation link handler
	$('body').on('click', 'a', function(e) {
		var urlPath = $(this).attr('href');
		var title = $(this).text();
		History.pushState({urlPath: urlPath}, title, urlPath);
		return false; // prevents default click action of <a ...>
	});

});


// ======================= config ANGULAR ==============================
var xldApp = angular.module('xldApp', []);

xldApp.config(function ($controllerProvider, $sceProvider) {
	$sceProvider.enabled(false);
	xldApp.__controllerProvider = $controllerProvider;
});

// ======================= xld PAGE Framework ==============================
var xld = xld || {};
xld.Page = function(title) {
	this.title = title;
	
}

xldApp.controller('xldMain', ['$scope', function ($scope) {

	$scope.pages = {};
	$scope.pages[0] = new xld.Page('Első ablak');
	$scope.pages[1] = new xld.Page('Második ablak');
		
}]);

// ======================= resume ANGULAR BOOTSTRAP ==============================
angular.element().ready(function () {
	angular.resumeBootstrap(['xldApp']);
});
