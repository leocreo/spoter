angular.module('localia.controllers', ["leaflet-directive"])

//############################################################################### 
// Init Controller 
.controller('InitController', ['$scope', '$state', '$ionicHistory', 'LocaliaConfig', function($scope, $state, $ionicHistory, LocaliaConfig) {

	console.log("InitController");
	/*
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});

		if (LocaliaConfig.getCurrentCity() !== false) {
			console.log("> GO HOME START");
			console.log("> Cargamos en diferido el loadServerStartup para proximos usos.");
		} else {
			console.log("> Cargamos loadServerStartup y esperamos.... luego:");
			LocaliaConfig.loadServerStartup().then(function() {
				if (LocaliaConfig.predefinedCityId !== false) {
					LocaliaConfig.setCurrentCity(LocaliaConfig.predefinedCityId);
					console.log(">> Tiene prebundle la ciudad: Mostrar welcome a la ciudad y texto introductorio + boton comenzar.");
				} else {
					if (LocaliaConfig.server.detected_city_id !== false) {
						LocaliaConfig.setCurrentCity(LocaliaConfig.server.detected_city_id);
						console.log(">> El server detectó la ciudad: Mostrar welcome a la ciudad y texto introductorio + boton comenzar.");
					} else {
						console.log(">> Mostrar welcome + texto introductorio + selector de cuidad y boton comenzar.");
					}
				}
				//console.log("1", LocaliaConfig.userData.currentCity);
				$state.go('welcome');
			});
		}
		/*
			$state.go('welcome', {}, {
				location: 'replace'
			});*/

}])


//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', '$state', '$ionicPopup', 'LocaliaCategories', 'LocaliaConfig', function($scope, $state, $ionicPopup, LocaliaCategories, LocaliaConfig) {

	LocaliaConfig.events.on("localia:city.change", function(event, currentCity) {
		$scope.currentCity = currentCity;
		LocaliaCategories.clearCache();
		LocaliaCategories.findAll().then(function(data) {
			$scope.categories = data;
		});
	}, $scope);


	$scope.currentCity = LocaliaConfig.userData.currentCity;
	LocaliaCategories.findAll().then(function(data) {
		$scope.categories = data;
	});


	$scope.goCategory = function(id) {
		$state.go('app.categories', {
			id: id
		});
	};
	$scope.goAd = function(id) {
		$state.go('app.ads', {
			id: id
		});
	};
	$scope.goEvent = function(id) {
		if (_.isUndefined(id))
			$state.go('app.events', {
				id: id
			});
		else
			$state.go('app.event', {
				id: id
			});
	};
	$scope.goPromo = function(id) {
		if (_.isUndefined(id))
			$state.go('app.promotions', {
				id: id
			});
		else
			$state.go('app.promo', {
				id: id
			});
	};
	$scope.goPlace = function(id) {
		if (_.isUndefined(id))
			$state.go('app.places', {
				id: id
			});
		else
			$state.go('app.place', {
				id: id
			});

	};
	$scope.changeCity = function() {
		// Show the action sheet
		var cityList = '<div class="list city-list-selector">';
		//cityList += '<div class="item item-divider">Recomendadas</div>';
		_.each(LocaliaConfig.getAvailablesCities(), function(city) {
			selected = "";
			if (Number(LocaliaConfig.userData.currentCity.id) == Number(city.id)) {
				selected = ' checked="checked" ';
			}
			cityList += '<label class="item item-radio "><input type="radio"  ng-model="data.new_city" name="data.new_city" value="' + city.id + '"' + selected + '><div class="item-content">' + city.name + '</div><i class="radio-icon ion-ios-checkmark assertive"></i></label>';
		});
		cityList += '</div>';
		$scope.data = {}
		var myPopup = $ionicPopup.show({
			template: cityList,
			title: 'Ciudad',
			subTitle: 'Selecciona tu ciudad:',
			scope: $scope,
			buttons: [{
				text: 'Cancelar'
			}, {
				text: '<b>Seleccionar</b>',
				type: 'button-positive',
				onTap: function(e) {
					return $scope.data.new_city;
				}
			}]
		});
		myPopup.then(function(selected_id) {
			LocaliaConfig.setCurrentCity(selected_id);
		});
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


}])


//############################################################################### 
// Welcome Controller 
.controller('WelcomeController', ['$scope', '$state', 'LocaliaConfig', function($scope, $state, LocaliaConfig) {
	$scope.goHome = function() {
		$state.go('app.home', {}, {
			location: 'replace'
		});
	};
	$scope.currentCity = LocaliaConfig.userData.currentCity;
}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$scope', '$state', 'LocaliaConfig', 'LocaliaCategories', 'LocaliaPromotions', '$ionicSlideBoxDelegate', function($scope, $state, LocaliaConfig, LocaliaCategories, LocaliaPromotions, $ionicSlideBoxDelegate) {

	console.log("Home Controller");
	return;

	LocaliaConfig.events.on("localia:city.change", function(event, currentCity) {
		LocaliaCategories.clearCache();
		LocaliaCategories.findAll({
			featured: 1
		}).then(function(data) {
			$scope.featuredCategories = data;
		});

		LocaliaPromotions.clearCache();
		LocaliaPromotions.findAll().then(function(data) {
			$scope.promotions = data;
			$ionicSlideBoxDelegate.update();
		});

	}, $scope);

	LocaliaCategories.findAll({
		featured: 1
	}).then(function(data) {
		$scope.featuredCategories = data;
	});

	LocaliaPromotions.findAll().then(function(data) {
		$scope.promotions = data;
		$ionicSlideBoxDelegate.update();
	});

}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$scope', '$stateParams', 'LocaliaConfig', 'LocaliaCategories', 'LocaliaAds', function($scope, $stateParams, LocaliaConfig, LocaliaCategories, LocaliaAds) {

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
	LocaliaCategories.findAll({
		parent_id: Number($stateParams.id)
	}).then(function(data) {
		$scope.childrenCategories = data;
		if ($scope.childrenCategories.length == 0) {
			LocaliaAds.findAll({
				id_categories: Number($stateParams.id)
			}).then(function(data) {
				$scope.ads = data;
			});
		}
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