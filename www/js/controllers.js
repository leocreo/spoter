angular.module('localia.controllers', ["leaflet-directive"])


//############################################################################### 
// Welcome Controller 
.controller('WelcomeController', ['$scope', '$state', '$stateParams', 'LocaliaConfig', function($scope, $state, $stateParams, LocaliaConfig) {
	$scope.goHome = function() {
		$state.go('home', {}, {
			location: 'replace'
		});
	};
	$scope.reload = function() {
		$scope.loading = true;
		LocaliaConfig.loadServerStartup().then(function() {
			$scope.loading = false;
			setup();
		});
	};

	function setup() {
		$scope.currentCity = LocaliaConfig.userData.currentCity;
		$scope.serverError = false;
		if (LocaliaConfig.serverConfig === false)
			$scope.serverError = true;
	}
	setup();
}])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', '$state', '$ionicPopup', 'LocaliaCategories', 'LocaliaConfig', function($scope, $state, $ionicPopup, LocaliaCategories, LocaliaConfig) {

	$scope.getAllCategories = function(reload) {
		if (reload)
			LocaliaCategories.clearCache();
		$scope.loader_categories = true;
		LocaliaCategories.findAll().then(function(data) {
			$scope.loader_categories = false;
			$scope.categories = data;
		}, function(error_code) {
			$scope.loader_categories = false;
			if (error_code == ERROR_NO_CONNECTION)
				$scope.errorConnection = true;
		});
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
		// Show the action sheet
		var cityList = '<div class="list city-list-selector">';
		//cityList += '<div class="item item-divider">Recomendadas</div>';
		_.each(LocaliaConfig.getAvailablesCities(), function(city) {
			cityList += '<label class="item item-radio" ng-click="selectCity()"><input type="radio"  ng-model="data.new_city" name="data.new_city" value="' + city.id + '"><div class="item-content">' + city.name + '</div><i class="radio-icon ion-ios-checkmark assertive"></i></label>';
		});
		cityList += '</div>';
		$scope.data = {
			new_city: LocaliaConfig.userData.currentCity.id
		};
		cityPopup = $ionicPopup.show({
			template: cityList,
			title: 'Ciudad',
			subTitle: 'Selecciona tu ciudad:',
			scope: $scope,
			buttons: [{
				text: 'Cancelar'
			}]
		});
		$scope.selectCity = function() {
			LocaliaConfig.setCurrentCity($scope.data.new_city);
			cityPopup.close();
		};
	};


	angular.extend($scope, {
		map: {
			center: {
				lat: -63.4350586,
				lng: -35.4427709,
				zoom: 15
			},
			markers: {
				ad: {
					lat: -63.4350586,
					lng: -35.4427709,
					draggable: false
				}
			},
			defaults: {
				scrollWheelZoom: true
			}
		}
	});

	LocaliaConfig.events.on("localia:city.change", function(event, currentCity) {
		$scope.currentCity = currentCity;
		$scope.getAllCategories(true);
	}, $scope);

	$scope.currentCity = LocaliaConfig.userData.currentCity;
	$scope.getAllCategories();
}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$scope', '$state', 'LocaliaConfig', 'LocaliaCategories', 'LocaliaPlaces', '$ionicSlideBoxDelegate', function($scope, $state, LocaliaConfig, LocaliaCategories, LocaliaPlaces, $ionicSlideBoxDelegate) {

	LocaliaConfig.events.on("localia:city.change", function(event, currentCity) {
		$scope.getFeatured();
		$scope.getPlaces();
	}, $scope);

	$scope.getFeatured = function(reload) {
		if (reload)
			LocaliaCategories.clearCache();
		$scope.loader_categories = true;
		LocaliaCategories.findAll({
			featured: 1
		}).then(function(data) {
			$scope.loader_categories = false;
			$scope.featuredCategories = data;
		}, function(error_code) {
			$scope.loader_categories = false;
			if (error_code == ERROR_NO_CONNECTION)
				$scope.errorConnection = true;
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
.controller('CategoriesController', ['$scope', '$stateParams', 'LocaliaConfig', 'LocaliaCategories', 'LocaliaAds', function($scope, $stateParams, LocaliaConfig, LocaliaCategories, LocaliaAds) {

	$scope.mainScreen = true;
	if ($stateParams.id)
		$scope.mainScreen = false;

	// Obtenemos categoria actual + categoria padre
	LocaliaCategories.find({
		id: Number($stateParams.id)
	}).then(function(data) {
		$scope.category = data;
		LocaliaCategories.find({
			id: Number(data.parent_id)
		}).then(function(data) {
			$scope.parentCategory = data;
		});
	});

	// Obtenemos las categorías hijas de la categoria actual y si no tiene categorias hijas cargamos la lista de Ads
	$scope.showBanner = false;
	LocaliaCategories.findAll({
		parent_id: Number($stateParams.id)
	}).then(function(data) {
		$scope.childrenCategories = data;
		if ($scope.childrenCategories.length == 0) {
			$scope.loader_category_ads = true;
			$scope.showBanner = true;
			LocaliaAds.findAll({
				id_categories: Number($stateParams.id)
			}).then(function(data) {
				$scope.loader_category_ads = false;
				$scope.ads = data;
			});
		}
	}, function(error_code) {
		console.log("*");
	});
}])

//############################################################################### 
// Ads Controller 
.controller('AdsController', ['$scope', '$stateParams', 'LocaliaConfig', 'LocaliaCategories', 'LocaliaAds', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaConfig, LocaliaCategories, LocaliaAds, $ionicSlideBoxDelegate) {


	// Traemos data completa del Anuncio
	LocaliaAds.get(Number($stateParams.id)).then(function(data) {
		$scope.ad = data;
		$scope.map.center.lat = data.location.lat;
		$scope.map.center.lng = data.location.lng;
		$scope.map.markers.ad.lat = data.location.lat;
		$scope.map.markers.ad.lng = data.location.lng;
		$ionicSlideBoxDelegate.update();
	});

}])


//############################################################################### 
// Promotions Controller 
.controller('PromotionsController', ['$scope', '$stateParams', 'LocaliaConfig', 'LocaliaPromotions', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaConfig, LocaliaPromotions, $ionicSlideBoxDelegate) {

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
.controller('EventsController', ['$scope', '$stateParams', 'LocaliaConfig', 'LocaliaEvents', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaConfig, LocaliaEvents, $ionicSlideBoxDelegate) {
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
.controller('PlacesController', ['$scope', '$stateParams', 'LocaliaConfig', 'LocaliaPlaces', '$ionicSlideBoxDelegate', function($scope, $stateParams, LocaliaConfig, LocaliaPlaces, $ionicSlideBoxDelegate) {
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