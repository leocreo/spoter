angular.module('localia.controllers', ["leaflet-directive"])

//############################################################################### 
// Init Controller 
.controller("InitController", ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {

	if ($rootScope.LocaliaConfig.getCurrentCity() !== false) {
		console.log($state.current.name);
		if ($state.current.name == "init")
			$state.go('home');
	} else {
		if ($rootScope.LocaliaConfig.predefinedCityId !== false) {
			$rootScope.LocaliaConfig.setCurrentCity($rootScope.LocaliaConfig.predefinedCityId);
		} else {
			if ($rootScope.LocaliaConfig.serverConfig !== false && $rootScope.LocaliaConfig.serverConfig.default_city)
				$rootScope.LocaliaConfig.setCurrentCity($rootScope.LocaliaConfig.serverConfig.default_city);
		}
		$state.go('welcome');
	}
}])

//############################################################################### 
// Welcome Controller 
.controller('WelcomeController', ['$rootScope', '$scope', '$state', '$stateParams', '$ionicSlideBoxDelegate', function($rootScope, $scope, $state, $stateParams, $ionicSlideBoxDelegate) {

	$scope.goHome = function() {
		$state.go('home', {}, {
			location: 'replace'
		});
	};
	$scope.reload = function() {
		$scope.loading = true;
		$rootScope.LocaliaConfig.loadServerStartup().then(function() {
			$scope.loading = false;
			setup();
		});
	};
	$scope.continue = function() {
		$ionicSlideBoxDelegate.slide(1);
	}
	$scope.start = function(city_id) {
		$rootScope.LocaliaConfig.setCurrentCity(city_id);
		$state.go('home', {}, {
			location: 'replace'
		});
	}

	function setup() {
		$scope.currentCity = $rootScope.LocaliaConfig.userData.currentCity;
		$scope.cities = $rootScope.LocaliaConfig.getAvailablesCities();
		$ionicSlideBoxDelegate.update();
		$scope.serverError = false;
		if ($rootScope.LocaliaConfig.serverConfig === false)
			$scope.serverError = true;
	}
	setup();
}])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['_', '$rootScope', '$scope', '$state', '$ionicPopup', 'LocaliaCategories', '$ionicBackdrop', function(_, $rootScope, $scope, $state, $ionicPopup, LocaliaCategories, $ionicBackdrop) {

	$scope.getAllCategories = function(reload) {
		if (reload)
			categories.clearCache();
		$scope.loading_categories = true;
		$scope.errorConnection = false;
		LocaliaCategories.findAll().then(function(data) {
			$scope.loading_categories = false;
			$scope.categories = data;
		}, function(error, data) {
			if (error.code > 0)
				$scope.errorConnection = true;
			$scope.loading_categories = false;
		});
	};
	$scope.goHome = function() {
		$state.go('home');
	};
	$scope.goCategory = function(id) {
		$state.go('categories', {
			id: id
		});
	};
	$scope.goAd = function(id) {
		$state.go('ads', {
			id: id
		});
	};
	$scope.goEvent = function(id) {
		if (_.isUndefined(id))
			$state.go('events', {
				id: id
			});
		else
			$state.go('event', {
				id: id
			});
	};
	$scope.goPromo = function(id) {
		if (_.isUndefined(id))
			$state.go('promotions', {
				id: id
			});
		else
			$state.go('promo', {
				id: id
			});
	};
	$scope.goPlace = function(id) {
		if (_.isUndefined(id))
			$state.go('places', {
				id: id
			});
		else
			$state.go('place', {
				id: id
			});

	};
	$scope.changeCity = function() {

		if (_.isUndefined($rootScope.LocaliaConfig.getAvailablesCities()) || $rootScope.LocaliaConfig.getAvailablesCities().length <= 1)
			return false;

		// Show the action sheet
		var cityList = '<div class="list city-list-selector">';
		//cityList += '<div class="item item-divider">Recomendadas</div>';
		_.each($rootScope.LocaliaConfig.getAvailablesCities(), function(city) {
			cityList += '<label class="item item-radio" ng-click="selectCity()"><input type="radio"  ng-model="data.new_city" name="data.new_city" value="' + city.id + '"><div class="item-content">' + city.city + '</div><i class="radio-icon ion-ios-checkmark assertive"></i></label>';
		});
		cityList += '</div>';
		$scope.data = {
			new_city: $rootScope.LocaliaConfig.userData.currentCity.id
		};
		cityPopup = $ionicPopup.show({
			template: cityList,
			cssClass: 'popup-city-selector',
			title: 'Ciudad',
			subTitle: 'Selecciona tu ciudad:',
			scope: $scope,
			buttons: [{
				text: 'Cancelar'
			}]
		});
		$scope.selectCity = function() {
			$rootScope.LocaliaConfig.setCurrentCity($scope.data.new_city);
			cityPopup.close();
			$state.go('home');
		};
	};

	$scope.searchFunction = function(key) {
		console.log("Buscar: " + key);
	};

	$rootScope.LocaliaConfig.events.on("localia:city.change", function(event, currentCity) {
		$scope.currentCity = currentCity;
		$scope.getAllCategories(true);
	}, $scope);

	$scope.currentCity = $rootScope.LocaliaConfig.getCurrentCity();
	$scope.getAllCategories();
}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$rootScope', '$scope', '$state', 'LocaliaCategories', 'LocaliaPlaces', '$ionicSlideBoxDelegate', function($rootScope, $scope, $state, LocaliaCategories, LocaliaPlaces, $ionicSlideBoxDelegate) {

	$rootScope.LocaliaConfig.events.on("localia:city.change", function(event, currentCity) {
		$scope.getFeatured();
		$scope.getPlaces();
	}, $scope);


	$scope.getFeatured = function(reload) {
		if (reload)
			LocaliaCategories.clearCache();
		$scope.loading_categories = true;
		$scope.errorConnection = false;
		LocaliaCategories.findAll({
			featured: 1
		}).then(function(data) {
			$scope.loading_categories = false;
			$scope.featuredCategories = data;
		}, function(error, data) {
			if (error.code > 0)
				$scope.errorConnection = true;
			$scope.loading_categories = false;
		});
	};
	$scope.getPlaces = function(reload) {
		LocaliaPlaces.clearCache();
		/*
		LocaliaPlaces.findAll().then(function(data) {
			$scope.promotions = data;
			$ionicSlideBoxDelegate.update();
		});*/
	}

	$scope.getPlaces();
	$scope.getFeatured();

}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$rootScope', '$scope', '$stateParams', 'LocaliaCategories', 'LocaliaAds', '$ionicNavBarDelegate', function($rootScope, $scope, $stateParams, LocaliaCategories, LocaliaAds, $ionicNavBarDelegate) {


	// Si se especifica id de categoría..... sino, se muestran todas las categorias padre
	if (!_.isUndefined($stateParams.id) && !_.isEmpty($stateParams.id)) {
		$scope.mainScreen = false;
		$scope.loading_category_ads = true;
		LocaliaCategories.get(Number($stateParams.id)).then(
			function(data) {
				$scope.category = data;

				// Obtengo categoría padre de la categoría actual
				LocaliaCategories.get(data.parent_id).then(
					function(data) {
						$scope.parentCategory = data;
					},
					function(error) {}
				);

				// Obtengo categorias hijas de la categoria actual
				LocaliaCategories.findAll({
					parent_id: Number($stateParams.id)
				}).then(
					function(data) {
						$scope.childrenCategories = data;
						//Cargamos las ADS si no tiene categorias hijas
						if (data.length == 0) {
							$scope.showBanner = true;
							$scope.loading_category_ads = true;
							LocaliaAds.findAll({
								id_categories: Number($stateParams.id)
							}).then(
								function(data) {
									$scope.loading_category_ads = false;
									$scope.ads = data;
								},
								function(error) {}
							);
						}
					},
					function(error) {}
				);
				$scope.loading_category_ads = false;
			},
			function(error) {}
		);
	} else {
		// Mostrar solo categorias padres
		$scope.loading_categories = true;
		$scope.mainScreen = true;
		LocaliaCategories.findAll({
			parent_id: 0
		}).then(
			function(data) {
				$scope.loading_categories = false;
				$scope.childrenCategories = data;
			},
			function(error) {
				$scope.loading_categories = false;
			}
		);
	}

}])

//############################################################################### 
// Ads Controller 
.controller('AdsController', ['$scope', '$stateParams', 'LocaliaCategories', 'LocaliaAds', '$ionicSlideBoxDelegate', 'leafletData', function($scope, $stateParams, LocaliaCategories, LocaliaAds, $ionicSlideBoxDelegate, leafletData) {

	angular.extend($scope, {
		map_defaults: {
			zoom: 16,
			tileLayerOptions: {
				//detectRetina: true,
				attribution: '© OpenStreetMap</a>'
			}
		},
		map_markers: {},
		map_center: {
			autoDiscover: true
		},

	});

	$scope.loading_ad = false;

	if (!_.isUndefined($stateParams.id) && !_.isEmpty($stateParams.id)) {
		$scope.loading_ad = true;
		LocaliaAds.get(Number($stateParams.id)).then(
			function(data) {
				$scope.loading_ad = false;
				$scope.ad = data;
				$scope.map_markers = {
					m1: {
						lat: Number(data.lat),
						lng: Number(data.lon),
					}
				};
				$scope.map_center = {
					lat: Number(data.lat),
					lng: Number(data.lon),
					zoom: 16
				};
				$ionicSlideBoxDelegate.update();
			},
			function(error) {
				$scope.loading_ad = false;
			}
		);
	}

}])


//############################################################################### 
// Promotions Controller 
.controller('PromotionsController', ['$scope', '$stateParams', 'LocaliaPromotions', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaPromotions, $ionicSlideBoxDelegate) {

	if ($stateParams.id) {
		LocaliaPromotions.get($stateParams.id).then(function(data) {
			$scope.promo = data;
			$scope.map.center.lat = data.location.lat;
			$scope.map.center.lng = data.location.lng;
			$scope.map.markers.ad.lat = data.location.lat;
			$scope.map.markers.ad.lng = data.location.lng;
			$ionicSlideBoxDelegate.update();
		});
	} else {
		LocaliaPromotions.findAll().then(function(data) {
			$scope.promotions = data;
		});
	}

}])

//############################################################################### 
// Events Controller 
.controller('EventsController', ['$scope', '$stateParams', 'LocaliaEvents', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaEvents, $ionicSlideBoxDelegate) {
	if ($stateParams.id) {
		LocaliaEvents.get($stateParams.id).then(function(data) {
			$scope.event = data;
			$scope.map.center.lat = data.location.lat;
			$scope.map.center.lng = data.location.lng;
			$scope.map.markers.ad.lat = data.location.lat;
			$scope.map.markers.ad.lng = data.location.lng;
			$ionicSlideBoxDelegate.update();
		});
	} else {
		LocaliaEvents.findAll().then(function(data) {
			$scope.events = data;
		});
	}
}])

//############################################################################### 
// Placess Controller 
.controller('PlacesController', ['$scope', '$stateParams', 'LocaliaPlaces', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaPlaces, $ionicSlideBoxDelegate) {
	if ($stateParams.id) {
		LocaliaPlaces.get($stateParams.id).then(function(data) {
			$scope.place = data;
			$scope.map.center.lat = data.location.lat;
			$scope.map.center.lng = data.location.lng;
			$scope.map.markers.ad.lat = data.location.lat;
			$scope.map.markers.ad.lng = data.location.lng;
			$ionicSlideBoxDelegate.update();
		});
	} else {
		LocaliaPlaces.findAll().then(function(data) {
			$scope.places = data;
		});
	}
}])