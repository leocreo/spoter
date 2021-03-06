angular.module('localia', ['ionic', 'localia.controllers', 'localia.services', 'localia.directives', 'lazyImageLoader', 'ngCordova', 'imageSlideshow'])


// Underscore service
.factory("_", ['$window', function($window) {
	var _ = $window._;
	return (_);
}])

.run(function($ionicPlatform, $state, $templateCache, $ionicHistory, $cordovaGoogleAnalytics, $ionicSideMenuDelegate) {
	$ionicPlatform.ready(function() {

		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

		document.addEventListener("menubutton", onHardwareMenuKeyDown, false);

		// TEST - DESCOMENTAR EN PROD.
		//$templateCache.removeAll();	

		//if ($cordovaGoogleAnalytics) {
		//	$cordovaGoogleAnalytics.startTrackerWithId(LocaliaConfig.config.gaCode);
		//}
	});

	function onHardwareMenuKeyDown() {
		$ionicSideMenuDelegate.toggleLeft();
	}
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
				config: function(LocaliaConfig, $rootScope) {
					return LocaliaConfig.init().then(function(config) {
						$rootScope.LocaliaConfig = config;
					});
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
		.state('categories/root', {
			url: "/categories/root",
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
			params: {
				'preloaded_data': null
			},
			views: {
				"content": {
					templateUrl: "templates/ad.html",
					controller: 'AdsController',
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



angular.module('imageSlideshow', [])
	.factory('imageSlideshow', ['$ionicModal', '$ionicSlideBoxDelegate', '$timeout', function($ionicModal, $ionicSlideBoxDelegate, $timeout) {
		var service = {};
		var scope;
		var modal;

		service.open = function(images, options) {
			scope = options.scope;
			scope.images = images;
			console.log(options);
			if (_.isUndefined(options.actualIndex))
				scope.imageSlideshowSlideIndex = 0;
			else
				scope.imageSlideshowSlideIndex = options.actualIndex;
			$ionicModal.fromTemplateUrl('templates/image-slideshow.html', {
				scope: scope,
				backdropClickToClose: false,
				animation: 'slide-in-up'
			}).then(function(newModal) {
				modal = newModal;
				scope.openModal();
			});

			scope.openModal = function() {
				modal.show();
			};

			scope.closeModal = function() {
				modal.remove();
				modal.hide();
			};

			scope.next = function() {
				$ionicSlideBoxDelegate.next();
			};

			scope.previous = function() {
				$ionicSlideBoxDelegate.previous();
			};

			scope.slideChanged = function(index) {
				scope.imageSlideshowSlideIndex = index;
			};

			scope.$on('$destroy', function() {
				modal.remove();
			});

			scope.$on('modal.hide', function() {
				modal.remove();
			});

			scope.$on('modal.shown', function() {
				$ionicSlideBoxDelegate.slide(scope.imageSlideshowSlideIndex, 0);
			});



		};

		return service;
	}])