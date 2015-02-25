angular.module('localia.services', ['angular-data.DSCacheFactory', 'LocalForageModule'])

// Service global para startup de la app y almacenar informacion global
.service("LocaliaConfig", ['EventsService', '$localForage', '$q', '$http', function(EventsService, $localForage, $q, $http) {
	var service = {};

	angular.extend(service, {
		events: EventsService
	});
	service.config = {
		appCodName: 'Localia',
		appName: 'Localia',
		appVersion: '1.0',
		api: {
			endpoint: 'http://spoter-server/api/' // DEV
				// endpoint: 'http://localia.mobi/api/' // PRODUCCION
		}
	};
	service.userData = {
		currentCity: false
	};
	service.initiated = false;
	service.server = {};
	service.predefinedCityId = false;

	service.setCurrentCity = function(id) {
		var city = _.findWhere(service.getAvailablesCities(), {
			id: id
		});
		if (city) {
			this.userData.currentCity = city;
			$localForage.setItem("userData", this.userData);
			this.events.emit("localia:city.change", this.userData.currentCity);
		}
	};
	service.getCurrentCity = function() {
		return service.userData.currentCity;
	};

	service.getAvailablesCities = function() {
		return service.server.available_cities;
	};
	service.loadServerStartup = function() {
		return $http({
			url: service.config.api.endpoint + "startup",
			method: 'GET',
			params: {},
			cache: false
		}).then(function(result) {
			service.server = result.data;
			return true;
		});
	}
	service.loadUserData = function() {
		var deferred = $q.defer();
		$localForage.getItem("userData").then(function(data) {
			if (data !== undefined)
				service.userData = data;
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	service.init = function() {
		var deferred = $q.defer();
		service.loadUserData().then(function() {
			console.log("LocaliaConfig initiated...");
			service.initiated = true;
			deferred.resolve(service);
		});
		return deferred.promise;
	};

	return service;
}])

// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################
// Resource/Model: CATEGORIES 
.factory('LocaliaCategories', ['$http', '$q', '_', 'LocaliaConfig', 'DSCacheFactory', function($http, $q, _, LocaliaConfig, DSCacheFactory) {

	var resource_endpoint = LocaliaConfig.config.api.endpoint + "categories";
	var localCache = DSCacheFactory('spoterCategoriesCache', {
		maxAge: ((1000 * 60 * 60) * 1), // Una hora de cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de elementos que coincidan con el query dado (object)
		findAll: function(query) {
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
.factory('LocaliaAds', ['$http', '$q', '_', 'LocaliaConfig', 'DSCacheFactory', function($http, $q, _, LocaliaConfig, DSCacheFactory) {

	var resource_endpoint = LocaliaConfig.config.api.endpoint + "ads";
	var localCache = DSCacheFactory('spoterAdsCache', {
		maxAge: ((1000 * 60 * 0)), // 
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
.factory('LocaliaPromotions', ['$http', '$q', '_', 'LocaliaConfig', 'DSCacheFactory', function($http, $q, _, LocaliaConfig, DSCacheFactory) {

	var resource_endpoint = LocaliaConfig.config.api.endpoint + "promotions";
	var localCache = DSCacheFactory('spoterPromotionsCache', {
		maxAge: ((1000 * 60 * 0)),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
.factory('LocaliaEvents', ['$http', '$q', '_', 'LocaliaConfig', 'DSCacheFactory', function($http, $q, _, LocaliaConfig, DSCacheFactory) {

	var resource_endpoint = LocaliaConfig.config.api.endpoint + "events";
	var localCache = DSCacheFactory('spoterEventsCache', {
		maxAge: ((1000 * 60 * 0)),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
.factory('LocaliaPlaces', ['$http', '$q', '_', 'LocaliaConfig', 'DSCacheFactory', function($http, $q, _, LocaliaConfig, DSCacheFactory) {

	var resource_endpoint = LocaliaConfig.config.api.endpoint + "places";
	var localCache = DSCacheFactory('spoterPlacesCache', {
		maxAge: ((1000 * 60 * 0)),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});
	var params = {};

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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
			params.city_id = LocaliaConfig.userData.currentCity.id;
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