angular.module('spoter.services', ['angular-data.DSCacheFactory'])

// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################
// Resource/Model: CATEGORIES 
.factory('SpoterCategories', ['$http', '$q', '_', 'appGlobals', 'DSCacheFactory', function($http, $q, _, appGlobals, DSCacheFactory) {

	var resource_endpoint = appGlobals.config.api.endpoint + "categories";
	var localCache = DSCacheFactory('spoterCategoriesCache', {
		maxAge: 3600000, // Una hora de cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage'
	});

	return {
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

		find: function(query) {
			return $http({
				url: resource_endpoint,
				method: 'GET',
				cache: localCache
			}).then(function(result) {
				if (query === undefined)
					return result.data;
				var find = _.findWhere(result.data, query);
				if (find == undefined)
					return [];
				return find;
			});
		},

		get: function(id) {
			if (id === undefined) return false;
			return $http({
				url: resource_endpoint,
				method: 'GET',
				cache: localCache
			}).then(function(result) {
				return (_.findWhere(result.data, {
					id: Number(id)
				}));
			});
		},

		clearCache: function() {
			return localCache.removeAll();
		}
	};
}])