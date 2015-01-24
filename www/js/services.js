angular.module('spoter.services', ['angular-data.DSCacheFactory'])

// Service global para almacenar informacion global de la app
.factory("SpoterConfig", ['$rootScope', 'EventsService', function($rootScope, EventsService) {
	var service = {};

	angular.extend(service, {
		events: EventsService
	});
	service.config = {
		appCodName: 'spoter',
		appName: 'Tu guía',
		appVersion: '1.0',
		api: {
			endpoint: 'http://spoter-server/api/'
		},
		defaultCityID: 1 // HARDCODED - Devería tomarlo del LocalStorage o detectarlo segun lógica
	};
	service.currentCity = {};
	service.availableCities = [{
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
	}];

	service.setCurrentCity = function(id) {
		var city = _.findWhere(this.availableCities, {
			id: Number(id)
		});
		if (city) {
			this.currentCity = city;
			this.events.emit("spoter:city.change", this.currentCity);
		}
	};
	service.init = function() {
		this.setCurrentCity(this.config.defaultCityID);
	};
	return service;
}])

// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################
// Resource/Model: CATEGORIES 
.factory('SpoterCategories', ['$http', '$q', '_', 'SpoterConfig', 'DSCacheFactory', function($http, $q, _, SpoterConfig, DSCacheFactory) {

	var resource_endpoint = SpoterConfig.config.api.endpoint + "categories";
	var localCache = DSCacheFactory('spoterCategoriesCache', {
		maxAge: ((1000 * 60 * 60) * 1), // Una hora de cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de elementos que coincidan con el query dado (object)
		findAll: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			return $http({
				url: resource_endpoint,
				method: 'GET',
				cache: localCache,
				params: params
			}).then(function(result) {
				if (query === undefined)
					return result.data;
				var find = _.where(result.data, query);
				if (find == undefined)
					return [];
				return find;
			});
		},

		// Devuelve un sólo elemento que coincida con el query dado (object)
		find: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			return $http({
				url: resource_endpoint,
				method: 'GET',
				cache: localCache,
				params: params
			}).then(function(result) {
				if (query === undefined)
					return result.data;
				var find = _.findWhere(result.data, query);
				return find;
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])

// Resource/Model: ADS 
.factory('SpoterAds', ['$http', '$q', '_', 'SpoterConfig', 'DSCacheFactory', function($http, $q, _, SpoterConfig, DSCacheFactory) {

	var resource_endpoint = SpoterConfig.config.api.endpoint + "ads";
	var localCache = DSCacheFactory('spoterAdsCache', {
		maxAge: ((1000 * 60 * 0)), // 
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		find: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				if (result.data.length > 0)
					return result.data[0];
				return result.data;
			});
		},

		get: function(id) {
			params.city_id = SpoterConfig.currentCity.id;
			return $http({
				url: resource_endpoint + "/" + id,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])

// Resource/Model: PROMOTIONS 
.factory('SpoterPromotions', ['$http', '$q', '_', 'SpoterConfig', 'DSCacheFactory', function($http, $q, _, SpoterConfig, DSCacheFactory) {

	var resource_endpoint = SpoterConfig.config.api.endpoint + "promotions";
	var localCache = DSCacheFactory('spoterPromotionsCache', {
		maxAge: ((1000 * 60 * 0)),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		find: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				if (result.data.length > 0)
					return result.data[0];
				return result.data;
			});
		},

		get: function(id) {
			params.city_id = SpoterConfig.currentCity.id;
			return $http({
				url: resource_endpoint + "/" + id,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])

// Resource/Model: EVENTS 
.factory('SpoterEvents', ['$http', '$q', '_', 'SpoterConfig', 'DSCacheFactory', function($http, $q, _, SpoterConfig, DSCacheFactory) {

	var resource_endpoint = SpoterConfig.config.api.endpoint + "events";
	var localCache = DSCacheFactory('spoterEventsCache', {
		maxAge: ((1000 * 60 * 0)),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		find: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				if (result.data.length > 0)
					return result.data[0];
				return result.data;
			});
		},

		get: function(id) {
			params.city_id = SpoterConfig.currentCity.id;
			return $http({
				url: resource_endpoint + "/" + id,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])


// Resource/Model: PLACES 
.factory('SpoterPlaces', ['$http', '$q', '_', 'SpoterConfig', 'DSCacheFactory', function($http, $q, _, SpoterConfig, DSCacheFactory) {

	var resource_endpoint = SpoterConfig.config.api.endpoint + "places";
	var localCache = DSCacheFactory('spoterPlacesCache', {
		maxAge: ((1000 * 60 * 0)),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		find: function(query) {
			params.city_id = SpoterConfig.currentCity.id;
			angular.extend(params, query);
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				if (result.data.length > 0)
					return result.data[0];
				return result.data;
			});
		},

		get: function(id) {
			params.city_id = SpoterConfig.currentCity.id;
			return $http({
				url: resource_endpoint + "/" + id,
				method: 'GET',
				params: params,
				cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])


.factory('EventsService', ['$rootScope', function($rootScope) {
	var msgBus = {};
	msgBus.emit = function(msg, data) {
		data = data || {}
		$rootScope.$emit(msg, data);
	};
	msgBus.on = function(msg, func, scope) {
		var unbind = $rootScope.$on(msg, func);
		if (scope) {
			scope.$on('$destroy', unbind);
		}
	};
	return msgBus;
}]);