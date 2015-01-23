angular.module('spoter', ['ionic', 'spoter.controllers', 'spoter.services', 'spoter.directives'])

// Service global para almacenar informacion global de la app
.factory("appGlobals", [function() {
	return {
		config: {
			appCodName: 'spoter',
			appName: 'Tu guía',
			appVersion: '1.0',
			api: {
				endpoint: 'http://spoter-server/api/'
			},
			currentCity: {
				id: 1,
				name: 'Villa General Belgrano',
				banner: "img/city-vgb.jpg"
			},
			availableCities: [{
				id: 1,
				name: 'Villa General Belgrano',
				banner: "img/city-vgb.jpg"
			}, {
				id: 2,
				name: 'Calamuchita',
				banner: "img/city-cordoba.jpg"
			}, {
				id: 3,
				name: 'Cordoba',
				banner: "img/city-cordoba.jpg"
			}, {
				id: 4,
				name: 'Villa Carlos Paz',
				banner: "img/city-cordoba.jpg"
			}, {
				id: 5,
				name: 'Mar del Plata',
				banner: "img/city-mar-del-plata",
			}, {
				id: 6,
				name: 'Mar de las Pampas',
				banner: 'img/city-mdp.jpg'
			}, {
				id: 7,
				name: 'Villa Gesell',
				banner: 'img/city-mdp.jpg'
			}, {
				id: 8,
				name: 'Pinamar',
				banner: 'img/city-mdp.jpg'
			}]
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
	$urlRouterProvider.otherwise('/home');
});