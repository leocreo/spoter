angular.module('spoter', ['ionic', 'spoter.controllers', 'spoter.services'])

// Service global para almacenar informacion global de la app
.factory("appGlobals", [function() {
	return {
		config: {
			appCodName: 'spoter',
			appName: 'Tu guía',
			appVersion: '1.0',
			api: {
				endpoint: 'http://spoter-server/api/'
			}
		}
	}
}])

// Underscore service
.factory("_", ['$window', function($window) {
	var _ = $window._;
	return (_);
}])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {

	// CONFIGURAMOS RUTAS Y VISTAS
	$stateProvider
		.state('app', {
			abstract: true,
			templateUrl: "templates/app.html",
			controller: 'AppController'
		})
		.state('app.home', {
			url: "/home",
			views: {
				"content": {
					templateUrl: "templates/home.html",
					controller: 'HomeController'
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
	$urlRouterProvider.otherwise('/home');
});