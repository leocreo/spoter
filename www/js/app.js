angular.module('spoter', ['ionic', 'spoter.config', 'spoter.controllers', 'spoter.services'])

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
	.config(function($stateProvider, $urlRouterProvider, appConfig) {

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
		$urlRouterProvider.otherwise('/home');
	});