angular.module('localia.services', ['angular-data.DSCacheFactory', 'LocalForageModule'])

//##################################################################################################################
// LOCALIACONFIG: Service global para startup de la app y almacenar informacion global
.factory("LocaliaConfig", ['EventsService', '$localForage', '$q', '$http', '$timeout', function(EventsService, $localForage, $q, $http, $timeout) {
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
		},
		gaCode: 'UA-60262215-1'
	};
	service.userData = {
		currentCity: false
	};
	service.initiated = false;
	service.serverConfig = false;
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
		return service.serverConfig.available_cities;
	};
	service.loadServerStartup = function() {
		var deferred = $q.defer();
		console.log("LocaliaConfig loading server config...");
		$http({
			url: service.config.api.endpoint + "startup",
			method: 'GET',
			params: {},
			cache: false
		}).then(function(result) {
			service.serverConfig = result.data;
			deferred.resolve(service.serverConfig);
		}, function(data, status) {
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

	service.init = function() {
		var deferred = $q.defer();
		console.log("LocaliaConfig loading local data...");
		service.loadUserData().then(function() {
			service.loadServerStartup().then(function() {
				console.log("LocaliaConfig initiated...");
				service.initiated = true;
				deferred.resolve(service);
			});
		});
		return deferred.promise;
	};

	return service;
}])

//############################################################################################################



// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################
// Resource/Model: CATEGORIES 
.factory('LocaliaCategories', ['_', 'LocaliaConfig', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaConfig, LocaliaApiService, DSCacheFactory) {

	var service = new LocaliaApiService();
	service.endpoint = LocaliaConfig.config.api.endpoint + "categories";
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
.factory('LocaliaAds', ['_', 'LocaliaConfig', 'DSCacheFactory', 'LocaliaApiService', function(_, LocaliaConfig, DSCacheFactory, LocaliaApiService) {

	var service = new LocaliaApiService();
	service.endpoint = LocaliaConfig.config.api.endpoint + "ads";
	service.cache = DSCacheFactory('localiaAds', {
		maxAge: ((1000 * 60 * 60) * .5),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return service;

}])

// Resource/Model: PROMOTIONS 
.factory('LocaliaPromotions', ['_', 'LocaliaConfig', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaConfig, LocaliaApiService, DSCacheFactory) {

	var service = new LocaliaApiService();
	service.endpoint = LocaliaConfig.config.api.endpoint + "promotions";
	service.cache = DSCacheFactory('localiaPromotions', {
		maxAge: ((1000 * 60 * 60) * 0),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return service;

}])

// Resource/Model: EVENTS 
.factory('LocaliaEvents', ['_', 'LocaliaConfig', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaConfig, LocaliaApiService, DSCacheFactory) {

	var service = new LocaliaApiService();
	service.endpoint = LocaliaConfig.config.api.endpoint + "events";
	service.cache = DSCacheFactory('localiaEvents', {
		maxAge: ((1000 * 60 * 60) * .2),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return service;

}])


// Resource/Model: PLACES 
.factory('LocaliaPlaces', ['_', 'LocaliaConfig', 'LocaliaApiService', 'DSCacheFactory', function(_, LocaliaConfig, LocaliaApiService, DSCacheFactory) {
	var service = new LocaliaApiService();
	service.endpoint = LocaliaConfig.config.api.endpoint + "places";
	service.cache = DSCacheFactory('localiaPlaces', {
		maxAge: ((1000 * 60 * 60) * .2),
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return service;

}])

// Master Factory para interactual con el API del Server
.factory('LocaliaApiService', ['$http', '$q', 'LocaliaConfig', 'EventsService', function($http, $q, LocaliaConfig, EventsService) {

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

	var globalParams = {
		city_id: LocaliaConfig.getCurrentCity().id
	};
	var service = function() {
		this.ERR_NETWORK_ERROR = 100;
		this.ERR_API_ERROR = 101;
		this.ERR_NOT_FOUND = 102;
		this.endpoint = null;
		this.cache = false;
		this.clearCache = function() {
			return this.cache.removeAll();
		}
		this._findAll = function(params) {
			var defer = $q.defer();
			$http({
				url: this.endpoint,
				method: 'GET',
				params: angular.extend({}, globalParams, params),
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
				url: this.endpoint,
				method: 'GET',
				params: angular.extend({}, globalParams, params),
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
				url: this.endpoint + (!_.isUndefined(id) ? "/" + id : ''),
				method: 'GET',
				params: angular.extend({}, globalParams, params),
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
}])