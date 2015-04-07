angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/app', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/nerds', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		})
		.otherwise({
  	  		redirectTo: '/app'
  	  	});

	$locationProvider.html5Mode(true);

}]);