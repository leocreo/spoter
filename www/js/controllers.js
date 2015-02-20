angular.module('spoter.controllers', ["leaflet-directive"])

//############################################################################### 
// Init Controller 
.controller('InitController', ['$scope', '$state', '$ionicHistory', 'SpoterConfig', function($scope, $state, $ionicHistory, SpoterConfig) {

	console.log("InitController");
	/*
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});

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
.controller('AppController', ['$scope', '$state', '$ionicPopup', 'SpoterCategories', 'SpoterConfig', function($scope, $state, $ionicPopup, SpoterCategories, SpoterConfig) {

	/*	SpoterConfig.events.on("spoter:city.change", function(event, currentCity) {
			$scope.currentCity = currentCity;
			SpoterCategories.clearCache();
			SpoterCategories.findAll().then(function(data) {
				$scope.categories = data;
			});
		}, $scope);
	*/
	/*
		$scope.currentCity = SpoterConfig.userData.currentCity;
		SpoterCategories.findAll().then(function(data) {
			$scope.categories = data;
		});*/

	console.log("AppController");
	return;

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
		_.each(SpoterConfig.availableCities, function(city) {
			selected = "";
			if (SpoterConfig.currentCity.id == Number(city.id)) {
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
			SpoterConfig.setCurrentCity(selected_id);
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
.controller('WelcomeController', ['$state', 'SpoterConfig', function($state, SpoterConfig) {
	console.log("WelcomeController");
	//	$scope.currentCity = SpoterConfig.userData.currentCity;
}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$scope', '$state', 'SpoterConfig', 'SpoterCategories', 'SpoterPromotions', '$ionicSlideBoxDelegate', function($scope, $state, SpoterConfig, SpoterCategories, SpoterPromotions, $ionicSlideBoxDelegate) {

	console.log("Home Controller");
	return;

	SpoterConfig.events.on("spoter:city.change", function(event, currentCity) {
		SpoterCategories.clearCache();
		SpoterCategories.findAll({
			featured: 1
		}).then(function(data) {
			$scope.featuredCategories = data;
		});

		SpoterPromotions.clearCache();
		SpoterPromotions.findAll().then(function(data) {
			$scope.promotions = data;
			$ionicSlideBoxDelegate.update();
		});

	}, $scope);

	SpoterCategories.findAll({
		featured: 1
	}).then(function(data) {
		$scope.featuredCategories = data;
	});

	SpoterPromotions.findAll().then(function(data) {
		$scope.promotions = data;
		$ionicSlideBoxDelegate.update();
	});

}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$scope', '$stateParams', 'SpoterConfig', 'SpoterCategories', 'SpoterAds', function($scope, $stateParams, SpoterConfig, SpoterCategories, SpoterAds) {

	// Obtenemos categoria actual + categoria padre
	SpoterCategories.find({
		id: Number($stateParams.id)
	}).then(function(data) {
		$scope.category = data;
		SpoterCategories.find({
			id: Number(data.parent_id)
		}).then(function(data) {
			$scope.parentCategory = data;
		});
	});

	// Obtenemos las categorías hijas de la categoria actual y si no tiene categorias hijas cargamos la lista de Ads
	SpoterCategories.findAll({
		parent_id: Number($stateParams.id)
	}).then(function(data) {
		$scope.childrenCategories = data;
		if ($scope.childrenCategories.length == 0) {
			SpoterAds.findAll({
				id_categories: Number($stateParams.id)
			}).then(function(data) {
				$scope.ads = data;
			});
		}
	});

}])

//############################################################################### 
// Ads Controller 
.controller('AdsController', ['$scope', '$stateParams', 'SpoterConfig', 'SpoterCategories', 'SpoterAds', '$ionicSlideBoxDelegate', function($scope, $stateParams, SpoterConfig, SpoterCategories, SpoterAds, $ionicSlideBoxDelegate) {


	// Traemos data completa del Anuncio
	SpoterAds.get(Number($stateParams.id)).then(function(data) {
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
.controller('PromotionsController', ['$scope', '$stateParams', 'SpoterConfig', 'SpoterPromotions', '$ionicSlideBoxDelegate', function($scope, $stateParams, SpoterConfig, SpoterPromotions, $ionicSlideBoxDelegate) {

	if ($stateParams.id) {
		SpoterPromotions.get($stateParams.id).then(function(data) {
			$scope.promo = data;
			$scope.map.center.lat = data.location.lat;
			$scope.map.center.lng = data.location.lng;
			$scope.map.markers.ad.lat = data.location.lat;
			$scope.map.markers.ad.lng = data.location.lng;
			$ionicSlideBoxDelegate.update();
		});
	} else {
		SpoterPromotions.findAll().then(function(data) {
			$scope.promotions = data;
		});
	}

}])

//############################################################################### 
// Events Controller 
.controller('EventsController', ['$scope', '$stateParams', 'SpoterConfig', 'SpoterEvents', '$ionicSlideBoxDelegate', function($scope, $stateParams, SpoterConfig, SpoterEvents, $ionicSlideBoxDelegate) {
	if ($stateParams.id) {
		SpoterEvents.get($stateParams.id).then(function(data) {
			$scope.event = data;
			$scope.map.center.lat = data.location.lat;
			$scope.map.center.lng = data.location.lng;
			$scope.map.markers.ad.lat = data.location.lat;
			$scope.map.markers.ad.lng = data.location.lng;
			$ionicSlideBoxDelegate.update();
		});
	} else {
		SpoterEvents.findAll().then(function(data) {
			$scope.events = data;
		});
	}
}])

//############################################################################### 
// Placess Controller 
.controller('PlacesController', ['$scope', '$stateParams', 'SpoterConfig', 'SpoterPlaces', '$ionicSlideBoxDelegate', function($scope, $stateParams, SpoterConfig, SpoterPlaces, $ionicSlideBoxDelegate) {
	if ($stateParams.id) {
		SpoterPlaces.get($stateParams.id).then(function(data) {
			$scope.place = data;
			$scope.map.center.lat = data.location.lat;
			$scope.map.center.lng = data.location.lng;
			$scope.map.markers.ad.lat = data.location.lat;
			$scope.map.markers.ad.lng = data.location.lng;
			$ionicSlideBoxDelegate.update();
		});
	} else {
		SpoterPlaces.findAll().then(function(data) {
			$scope.places = data;
		});
	}
}])