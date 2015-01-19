angular.module('spoter.controllers', ["leaflet-directive"])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', '$state', 'appGlobals', 'SpoterCategories', function($scope, $state, appGlobals, SpoterCategories) {
	$scope.currentCityName = "Villa General Belgrano";

	SpoterCategories.clearCache();
	SpoterCategories.findAll().then(function(data) {
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
// Home Front Controller 
.controller('HomeController', ['$scope', '$state', 'appGlobals', 'SpoterCategories', 'SpoterPromotions', '$ionicSlideBoxDelegate', function($scope, $state, appGlobals, SpoterCategories, SpoterPromotions, $ionicSlideBoxDelegate) {

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
.controller('CategoriesController', ['$scope', '$stateParams', 'appGlobals', 'SpoterCategories', 'SpoterAds', function($scope, $stateParams, appGlobals, SpoterCategories, SpoterAds) {

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
.controller('AdsController', ['$scope', '$stateParams', 'appGlobals', 'SpoterCategories', 'SpoterAds', '$ionicSlideBoxDelegate', function($scope, $stateParams, appGlobals, SpoterCategories, SpoterAds, $ionicSlideBoxDelegate) {


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
.controller('PromotionsController', ['$scope', '$stateParams', 'appGlobals', 'SpoterPromotions', '$ionicSlideBoxDelegate', function($scope, $stateParams, appGlobals, SpoterPromotions, $ionicSlideBoxDelegate) {

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
.controller('EventsController', ['$scope', '$stateParams', 'appGlobals', 'SpoterEvents', '$ionicSlideBoxDelegate', function($scope, $stateParams, appGlobals, SpoterEvents, $ionicSlideBoxDelegate) {
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
.controller('PlacesController', ['$scope', '$stateParams', 'appGlobals', 'SpoterPlaces', '$ionicSlideBoxDelegate', function($scope, $stateParams, appGlobals, SpoterPlaces, $ionicSlideBoxDelegate) {
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