angular.module('localia', ['ionic', 'localia.controllers', 'localia.services', 'localia.directives', 'imageLoader', 'ngCordova'])


// Underscore service
.factory("_", ['$window', function($window) {
	var _ = $window._;
	return (_);
}])

.run(function($ionicPlatform, $state, $templateCache, LocaliaConfig, $ionicHistory, $cordovaGoogleAnalytics) {
	$ionicPlatform.ready(function() {

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

		// TEST - DESCOMENTAR EN PROD.
		//$templateCache.removeAll();	

		//if ($cordovaGoogleAnalytics) {
		//	$cordovaGoogleAnalytics.startTrackerWithId(LocaliaConfig.config.gaCode);
		//}
	});
})

.config(function($stateProvider, $urlRouterProvider, $localForageProvider) {

	// CONFIGURAMOS ALMACENAMIENTO LOCAL
	$localForageProvider.config({
		name: 'Localia', // name of the database and prefix for your data, it is "lf" by default
		version: 1.0, // version of the database, you shouldn't have to use this
		storeName: 'localia', // name of the table
	});


	// CONFIGURAMOS RUTAS Y VISTAS
	$stateProvider
		.state('init', {
			url: '/init',
			template: '<ion-nav-view name="main"></ion-nav-view>',
			controller: 'InitController',
			resolve: {
				LocaliaConfig: function(LocaliaConfig) {
					if (LocaliaConfig.initiated)
						return LocaliaConfig;
					return LocaliaConfig.init();
				}
			}
		})
		.state('welcome', {
			url: '/welcome',
			parent: 'init',
			views: {
				'main': {
					templateUrl: "templates/welcome.html",
					controller: 'WelcomeController'
				}
			}
		})
		.state('app', {
			url: '/app',
			parent: 'init',
			views: {
				'main': {
					templateUrl: "templates/app.html",
					controller: "AppController"
				}
			},
			abstract: true
		})
		.state('home', {
			url: "/home",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/home.html",
					controller: "HomeController"
				}
			}
		})
		.state('categories', {
			url: "/categories/:id",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/categories.html",
					controller: 'CategoriesController'
				}
			}
		})
		.state('ads', {
			url: "/ads/:id",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/ad.html",
					controller: 'AdsController'
				}
			}
		})
		.state('promotions', {
			url: "/promotions",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/promotions.html",
					controller: 'PromotionsController'
				}
			}
		})
		.state('promo', {
			url: "/promotions/:id",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/promotion.html",
					controller: 'PromotionsController'
				}
			}
		})
		.state('events', {
			url: "/events",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/events.html",
					controller: 'EventsController'
				}
			}
		})
		.state('event', {
			url: "/events/:id",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/event.html",
					controller: 'EventsController'
				}
			}
		})
		.state('places', {
			url: "/places",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/places.html",
					controller: 'PlacesController'
				}
			}
		})
		.state('place', {
			url: "/places/:id",
			parent: 'app',
			views: {
				"content": {
					templateUrl: "templates/place.html",
					controller: 'PlacesController'
				}
			}
		})
	$urlRouterProvider.otherwise('/init');
});