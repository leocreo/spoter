angular.module('spoter.services', ['angular-data.DSCacheFactory'])

// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################
// Resource/Model: CATEGORIES 
.factory('SpoterCategories', ['$http', '$q', '_', 'appGlobals', 'DSCacheFactory', function($http, $q, _, appGlobals, DSCacheFactory) {

	var resource_endpoint = appGlobals.config.api.endpoint + "categories";
	var localCache = DSCacheFactory('spoterCategoriesCache', {
		maxAge: ((1000 * 60 * 60) * 1), // Una hora de cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return {
		// Devuelve un array de elementos que coincidan con el query dado (object)
		findAll: function(query) {
			return $http({
				url: resource_endpoint,
				method: 'GET',
				cache: localCache
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
			return $http({
				url: resource_endpoint,
				method: 'GET',
				cache: localCache
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
.factory('SpoterAds', ['$http', '$q', '_', 'appGlobals', 'DSCacheFactory', function($http, $q, _, appGlobals, DSCacheFactory) {

	var resource_endpoint = appGlobals.config.api.endpoint + "ads";
	var localCache = DSCacheFactory('spoterAdsCache', {
		maxAge: ((1000 * 60 * 5)), // 5 minutos cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: query,
				//cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		find: function(query) {
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: query,
				//cache: localCache
			}).then(function(result) {
				if (result.data.length > 0)
					return result.data[0];
				return result.data;
			});
		},

		get: function(id) {
			return $http({
				url: resource_endpoint + "/" + id,
				method: 'GET',
				//cache: localCache
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
.factory('SpoterPromotions', ['$http', '$q', '_', 'appGlobals', 'DSCacheFactory', function($http, $q, _, appGlobals, DSCacheFactory) {

	var resource_endpoint = appGlobals.config.api.endpoint + "promotions";
	var localCache = DSCacheFactory('spoterPromotionsCache', {
		maxAge: ((1000 * 60 * 5)), // 5 minutos cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return {
		// Devuelve un array de todos los elementos del recurso. Opcionalmente se peude especificar un objeto con variables a enviar
		findAll: function(query) {
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: query,
				//cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		find: function(query) {
			return $http({
				url: resource_endpoint,
				method: 'GET',
				params: query,
				//cache: localCache
			}).then(function(result) {
				if (result.data.length > 0)
					return result.data[0];
				return result.data;
			});
		},

		get: function(id) {
			return $http({
				url: resource_endpoint + "/" + id,
				method: 'GET',
				//cache: localCache
			}).then(function(result) {
				return result.data;
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])