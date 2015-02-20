angular.module('spoter', ['ionic', 'spoter.controllers', 'spoter.services', 'spoter.directives'])


// Underscore service
.factory("_", ['$window', function($window) {
	var _ = $window._;
	return (_);
}])

.service('MyService', function() {
	return {
		testData: 2
	};
})

.run(function($ionicPlatform, $state, $templateCache, SpoterConfig, $ionicHistory) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

		// TEST - DESCOMENTAR EN PROD.
		//$templateCache.removeAll();

		/*
				// Inicio app
				// Inicializamos el objeto de configuracion global tomando valores almacenados en DB local o dejando valores por defecto. 
				SpoterConfig.init().then(function() {
					if (SpoterConfig.getCurrentCity() !== false) {
						console.log("GO HOME START");
						console.log("Cargamos en diferido el loadServerStartup para proximos usos.");
					} else {
						console.log("Cargamos loadServerStartup y esperamos.... luego:");
						SpoterConfig.loadServerStartup().then(function() {
							if (SpoterConfig.predefinedCityId !== false) {
								SpoterConfig.setCurrentCity(SpoterConfig.predefinedCityId);
								console.log(">> Tiene prebundle la ciudad: Mostrar welcome a la ciudad y texto introductorio + boton comenzar.");
							} else {
								if (SpoterConfig.server.detected_city_id !== false) {
									SpoterConfig.setCurrentCity(SpoterConfig.server.detected_city_id);
									console.log(">> El server detectó la ciudad: Mostrar welcome a la ciudad y texto introductorio + boton comenzar.");
								} else {
									console.log(">> Mostrar welcome + texto introductorio + selector de cuidad y boton comenzar.");
								}
							}
							console.log("1", SpoterConfig.userData.currentCity);
							//$state.go('welcome');
						});
					}
				});
		*/


	});
})

.config(function($stateProvider, $urlRouterProvider, $localForageProvider) {

	// CONFIGURAMOS ALMACENAMIENTO LOCAL
	$localForageProvider.config({
		name: 'SpoterApp', // name of the database and prefix for your data, it is "lf" by default
		version: 1.0, // version of the database, you shouldn't have to use this
		storeName: 'spoterapp', // name of the table
	});


	// CONFIGURAMOS RUTAS Y VISTAS
	$stateProvider
		.state('init', {
			url: '',
			template: '<ion-nav-view name="main"></ion-nav-view>',
			controller: 'InitController',
			resolve: {
				SpoterConfig: function(SpoterConfig, $q) {
					var deferred = $q.defer();
					SpoterConfig.init().then(function() {
						if (SpoterConfig.getCurrentCity() !== false) {
							console.log("> GO HOME START");
							console.log("> Cargamos en diferido el loadServerStartup para proximos usos.");
						} else {
							console.log("> Cargamos loadServerStartup y esperamos.... luego:");
							SpoterConfig.loadServerStartup().then(function() {
								if (SpoterConfig.predefinedCityId !== false) {
									SpoterConfig.setCurrentCity(SpoterConfig.predefinedCityId);
									console.log(">> Tiene prebundle la ciudad: Mostrar welcome a la ciudad y texto introductorio + boton comenzar.");
								} else {
									if (SpoterConfig.server.detected_city_id !== false) {
										SpoterConfig.setCurrentCity(SpoterConfig.server.detected_city_id);
										console.log(">> El server detectó la ciudad: Mostrar welcome a la ciudad y texto introductorio + boton comenzar.");
									} else {
										console.log(">> Mostrar welcome + texto introductorio + selector de cuidad y boton comenzar.");
									}
								}
								//console.log("1", SpoterConfig.userData.currentCity);
								//$state.go('welcome');
								deferred.resolve(SpoterConfig);
							});
						}
					});
					return deferred.promise;
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

	/*		.state('spoter', {
				abstract: true,
				resolve: {
					config: 'MyService'
				}
			})
			.state('welcome', {
				parent: 'spoter',
				url: "/welcome",
				controller: 'WelcomeController'
			})
		.state('app', {
			abstract: true,
			templateUrl: "templates/bootstrap.html",
			//templateUrl: "templates/app.html",
			controller: 'AppController',
			resolve: {
				config: 'MyService'
			}
		})
		.state('app.welcome', {
			url: "/welcome",
			views: {
				"content": {
					templateUrl: "templates/welcome.html",
					controller: 'WelcomeController'
				}
			}
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
	$urlRouterProvider.otherwise('/');*/
});