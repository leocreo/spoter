angular.module('localia.services', ['angular-data.DSCacheFactory', 'LocalForageModule'])

//##################################################################################################################
// LOCALIACONFIG: Service global para startup de la app y almacenar informacion global
.factory("LocaliaConfig", ['EventsService', '$localForage', '$q', '$http', '$timeout', '$cordovaGeolocation', function(EventsService, $localForage, $q, $http, $timeout, $cordovaGeolocation) {
	var service = {};

	angular.extend(service, {
		events: EventsService
	});
	service.config = {
		appCodName: 'Localia',
		appName: 'Localia',
		appVersion: '1.0',
		api: {
			endpoint: 'http://www.localia.com.ar/api/'
		},
		gaCode: 'UA-60262215-1'
	};
	service.userData = {
		currentCity: false,
		geolocation: null
	};
	service.initiated = false;
	service.serverConfig = false;
	service.predefinedCityId = false;

	service.setCurrentCity = function(id, force_update) {
		if (String(id) == String(service.getCurrentCity().id) && (angular.isUndefined(force_update) || force_update !== true))
			return;
		var city = _.findWhere(service.getAvailablesCities(), {
			id: String(id)
		});
		if (city) {
			var old_city_id = service.getCurrentCity().id;
			this.userData.currentCity = city;
			$localForage.setItem("userData", this.userData);
			if (String(old_city_id) != String(service.getCurrentCity().id)) {
				this.events.emit("localia:city.change", this.userData.currentCity);
			}
		}
	};
	service.getCurrentCity = function() {
		return service.userData.currentCity;
	};

	service.getAvailablesCities = function() {
		return service.serverConfig.available_cities;
	};
	service.loadServerStartup = function() {
		var deferred = $q.defer();
		console.log("LocaliaConfig: Loading server config...");
		$http({
			url: service.config.api.endpoint + "startup",
			method: 'GET',
			params: {
				lat: service.userData.geolocation.coords.latitude,
				lon: service.userData.geolocation.coords.longitude,
				city_id: service.getCurrentCity().id
			},
			cache: false
		}).then(function(result) {
			console.log("LocaliaConfig: Loading server config DONE.");
			service.serverConfig = {};
			service.serverConfig.available_cities = result.data;
			deferred.resolve(service.serverConfig);
		}, function(data, status) {
			console.log("LocaliaConfig: Loading server config DONE.");
			service.serverConfig = false;
			deferred.resolve(service.serverConfig);
		});
		return deferred.promise;
	};

	service.loadUserData = function() {
		var deferred = $q.defer();
		$localForage.getItem("userData").then(function(data) {
			if (data !== undefined)
				service.userData = data;
			deferred.resolve(data);
		});
		return deferred.promise;
	};

	service.getGeoLocation = function() {
		var options = {
			enableHighAccuracy: false,
			timeout: 5000
		};
		var deferred = $q.defer();
		if ($cordovaGeolocation) {
			console.log("LocaliaConfig: Getting geolocation...");
			return $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				console.log("LocaliaConfig: Getting geolocation DONE.");
				service.userData.geolocation = position;
				deferred.resolve();
			}, function(err) {
				console.log("LocaliaConfig: Getting geolocation FAILED.");
				deferred.resolve();
			});

		}
		service.userData.geolocation = null;
		return;
	};

	service.init = function() {
		var deferred = $q.defer();
		console.log("LocaliaConfig: Initializing app...");
		service.loadUserData().then(function() {
			if (service.getCurrentCity() === false) {
				console.log("LocaliaConfig: Initializing app DONE (first time).");
				service.getGeoLocation().then(function() {
					service.loadServerStartup().then(function() {
						service.initiated = true;
						deferred.resolve(service);
					});
				});
			} else {
				console.log("LocaliaConfig: Initializing app DONE.");
				service.initiated = true;
				deferred.resolve(service);
				service.getGeoLocation().then(function() {
					service.loadServerStartup().then(function() {
						if (service.getCurrentCity() !== false) {
							// Tareas en background con la info de STARTUP
							// Refrescamos data nueva de la ciudad (si hay) previamente seleccionada
							service.setCurrentCity(service.getCurrentCity().id, true);
						}
					});
				});
			}
		});
		return deferred.promise;
	};
	return service;
}])

//############################################################################################################



// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################
// Resource/Model: CATEGORIES 
.factory('LocaliaCategories', ['_', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaApiService, DSCacheFactory) {

	var service = LocaliaApiService();

	service.endpoint = "categories";
	service.cache = DSCacheFactory('localiaCategories', {
		maxAge: ((1000 * 60 * 60) * 1),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	// Redefinimos findAll  porque  las categorías siempre viene todas y el filtro lo aplico acá en lugar de dejar que lo haga el server
	service.findAll = function(params) {
		return service._findAll().then(function(data) {
			if (!_.isUndefined(params))
				return _.where(data, params);
			return data;
		});
	};

	// Redefinimos find  porque  las categorías siempre viene todas y el filtro lo aplico acá en lugar de dejar que lo haga el server
	service.find = function(params) {
		return service._find().then(function(data) {
			if (!_.isUndefined(params))
				return _.findWhere(data, params);
			return data;
		});
	};

	// Redefinimos get, aplicando filtro de id a lo que ya está cacheado
	service.get = function(id) {
		return service._findAll().then(function(data) {
			if (!_.isUndefined(id))
				return _.findWhere(data, {
					id: Number(id)
				});
			return data;
		});
	};

	return service;
}])

// Resource/Model: ADS 
.factory('LocaliaAds', ['_', 'DSCacheFactory', 'LocaliaApiService', '$filter', function(_, DSCacheFactory, LocaliaApiService, $filter) {

	var service = new LocaliaApiService();
	service.endpoint = "ads";
	service.cache = DSCacheFactory('localiaAds', {
		maxAge: ((1000 * 60 * 60) * 0),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	service.findAll = function(params) {
		return service._findAll(params).then(function(data) {
			var now = (new Date()).getTime();
			angular.forEach(data, function(value, key, data) {
				data[key].nuevo = service.isNew((new Date(value.created_at)).getTime(), now);
			});
			return data;
		});
	};

	service.find = function(params) {
		return service._find(params).then(function(data) {
			var now = (new Date()).getTime();
			angular.forEach(data, function(value, key, data) {
				data[key].nuevo = service.isNew((new Date(value.created_at)).getTime(), now);
			});
			return data;
		});
	};

	service.get = function(id) {
		return service._get(id).then(function(data) {
			var now = (new Date()).getTime();
			data.nuevo = service.isNew((new Date(data.created_at)).getTime(), now);
			return data;
		});
	};

	service.isNew = function(timeMs, nowMs) {
		var daysToBeOld = 10;
		if (_.isNumber(timeMs)) {
			if (Math.round((nowMs - timeMs) / 1000 / 60 / 60 / 24) <= daysToBeOld)
				return true;
		}
		return false;
	};

	return service;


}])

// Resource/Model: PROMOTIONS 
.factory('LocaliaPromotions', ['_', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaApiService, DSCacheFactory) {

	var service = new LocaliaApiService();
	service.endpoint = "promotions";
	service.cache = DSCacheFactory('localiaPromotions', {
		maxAge: ((1000 * 60 * 60) * 0),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return service;

}])

// Resource/Model: EVENTS 
.factory('LocaliaEvents', ['_', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaApiService, DSCacheFactory) {

	var service = new LocaliaApiService();
	service.endpoint = "events";
	service.cache = DSCacheFactory('localiaEvents', {
		maxAge: ((1000 * 60 * 60) * 0),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return service;

}])


// Resource/Model: PLACES 
.factory('LocaliaPlaces', ['_', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaApiService, DSCacheFactory) {
	var service = new LocaliaApiService();
	service.endpoint = "places";
	service.cache = DSCacheFactory('localiaPlaces', {
		maxAge: ((1000 * 60 * 60) * 0),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	// Redefinimos findAll  porque  las categorías siempre viene todas y el filtro lo aplico acá en lugar de dejar que lo haga el server
	service.findAll = function(params) {
		return service._findAll().then(function(data) {
			if (!_.isUndefined(params))
				return _.where(data, params);
			return data;
		});
	};

	// Redefinimos find  porque  las categorías siempre viene todas y el filtro lo aplico acá en lugar de dejar que lo haga el server
	service.find = function(params) {
		return service._find().then(function(data) {
			if (!_.isUndefined(params))
				return _.findWhere(data, params);
			return data;
		});
	};

	// Redefinimos get, aplicando filtro de id a lo que ya está cacheado
	service.get = function(id) {
		return service._findAll().then(function(data) {
			if (!_.isUndefined(id))
				return _.findWhere(data, {
					id: Number(id)
				});
			return data;
		});
	};
	return service;

}])

// Master Factory para interactual con el API del Server
.factory('LocaliaApiService', ['$rootScope', '$http', '$q', 'EventsService', function($rootScope, $http, $q, EventsService) {

	function parseResponseError(response) {
		var error = {};
		error.response = response.data;
		switch (response.status) {
			case 404:
				error.code = service.ERR_NOT_FOUND;
				error.text = response.statusText;
				break;
			case 500:
				error.code = service.ERR_API_ERROR;
				error.text = response.statusText;
				break;
			default:
				error.code = service.ERR_NETWORK_ERROR;
				error.text = "Network error";
				break;
		}
		//service.events.emit("localia:api_error", error);
		return error;
	}

	function parseResponseSuccess(response) {
		return response.data;
	}
	var service = function(config) {
		this.ERR_NETWORK_ERROR = 100;
		this.ERR_API_ERROR = 101;
		this.ERR_NOT_FOUND = 102;
		this.endpoint = null;
		this.cache = false;


		this.clearCache = function() {
			return this.cache.removeAll();
		}
		this._globalParams = function() {
			return {
				//	lat: $rootScope.LocaliaConfig.userData.geolocation.coords.latitude,
				//	lon: $rootScope.LocaliaConfig.userData.geolocation.coords.longitude,
				city_id: $rootScope.LocaliaConfig.getCurrentCity().id,
			};
		}
		this._findAll = function(params) {

			var defer = $q.defer();
			$http({
				url: $rootScope.LocaliaConfig.config.api.endpoint + this.endpoint,
				method: 'GET',
				params: angular.extend({}, this._globalParams(), params),
				cache: this.cache
			}).then(
				function(response) {
					defer.resolve(parseResponseSuccess(response));
				},
				function(response) {
					defer.reject(parseResponseError(response));
				});
			return defer.promise;
		}
		this.findAll = function(params) {
			return this._findAll(params);
		}
		this._find = function(params) {
			var defer = $q.defer();
			$http({
				url: $rootScope.LocaliaConfig.config.api.endpoint + this.endpoint,
				method: 'GET',
				params: angular.extend({}, this._globalParams(), params),
				cache: this.cache
			}).then(
				function(response) {
					var data = parseResponseSuccess(response);
					if (_.isArray(data) && data.length > 0)
						data = data[0];
					defer.resolve(data);
				},
				function(response) {
					defer.reject(parseResponseError(response));
				});
			return defer.promise;
		}
		this.find = function(params) {
			return this._find(params);
		}
		this._get = function(id, params) {
			var defer = $q.defer();
			$http({
				url: $rootScope.LocaliaConfig.config.api.endpoint + this.endpoint + (!_.isUndefined(id) ? "/" + id : ''),
				method: 'GET',
				params: angular.extend({}, this._globalParams(), params),
				cache: this.cache
			}).then(
				function(response) {
					defer.resolve(parseResponseSuccess(response));
				},
				function(response) {
					defer.reject(parseResponseError(response));
				});
			return defer.promise;
		}
		this.get = function(id) {
			return this._get(id);
		}
		return this;
	};
	angular.extend(service, {
		events: EventsService
	});
	return service;
}])

// ##########################################################################################################



// GENERAL SERVICES:  ###########################################################################################
// EventService para agregar capacidad de emitir o recibir eventos a cualquier Servicio o Factory
.factory('EventsService', ['$rootScope', function($rootScope) {
	var msgBus = {};
	msgBus.emit = function(msg, data) {
		data = data || {};
		console.log("Event emit ->" + msg);
		$rootScope.$emit(msg, data);
	};
	msgBus.on = function(msg, func, scope) {
		var unbind = $rootScope.$on(msg, func);
		if (scope) {
			scope.$on('$destroy', unbind);
		}
	};
	return msgBus;
}])