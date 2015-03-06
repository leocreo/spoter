var ERROR_NO_CONNECTION = 100;

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
			url: '',
			template: '<ion-nav-view name="main"></ion-nav-view>',
			controller: 'InitController',
			resolve: {
				LocaliaConfig: function(LocaliaConfig, $q, $state) {
					var deferred = $q.defer();
					if (LocaliaConfig.initiated)
						return LocaliaConfig;
					LocaliaConfig.init().then(function(LocaliaConfig) {
						if (LocaliaConfig.getCurrentCity() !== false) {
							deferred.resolve(LocaliaConfig);
							$state.go('app.home', {}, {
								location: 'replace'
							});
						} else {
							if (LocaliaConfig.predefinedCityId !== false) {
								LocaliaConfig.setCurrentCity(LocaliaConfig.predefinedCityId);
							} else {
								if (LocaliaConfig.serverConfig !== false && LocaliaConfig.serverConfig.default_city)
									LocaliaConfig.setCurrentCity(LocaliaConfig.serverConfig.default_city);
							}
							deferred.resolve(LocaliaConfig);
							$state.go('welcome', {}, {
								location: 'replace'
							});
						}
					});
					return deferred.promise();
				}
			}
		})
		.state('welcome', {
			url: '/welcome/:serverError',
			parent: 'init',
			cache: false,
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
		.state('app.home', {
			url: "/home",
			views: {
				"content": {
					templateUrl: "templates/home.html",
					controller: "HomeController"
				}
			}
		})

	.state('app.categories', {
			url: "/categories/:id",
			views: {
				"content": {
					templateUrl: "templates/categories.html",
					controller: 'CategoriesController'
				}
			}
		})
		.state('app.ads', {
			url: "/ads/:id",
			views: {
				"content": {
					templateUrl: "templates/ad.html",
					controller: 'AdsController'
				}
			}
		})
		.state('app.promotions', {
			url: "/promotions",
			views: {
				"content": {
					templateUrl: "templates/promotions.html",
					controller: 'PromotionsController'
				}
			}
		})
		.state('app.promo', {
			url: "/promotions/:id",
			views: {
				"content": {
					templateUrl: "templates/promotion.html",
					controller: 'PromotionsController'
				}
			}
		})
		.state('app.events', {
			url: "/events",
			views: {
				"content": {
					templateUrl: "templates/events.html",
					controller: 'EventsController'
				}
			}
		})
		.state('app.event', {
			url: "/events/:id",
			views: {
				"content": {
					templateUrl: "templates/event.html",
					controller: 'EventsController'
				}
			}
		})
		.state('app.places', {
			url: "/places",
			views: {
				"content": {
					templateUrl: "templates/places.html",
					controller: 'PlacesController'
				}
			}
		})
		.state('app.place', {
			url: "/places/:id",
			views: {
				"content": {
					templateUrl: "templates/place.html",
					controller: 'PlacesController'
				}
			}
		})
	$urlRouterProvider.otherwise('/');
});