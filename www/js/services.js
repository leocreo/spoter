angular.module('spoter.services', ['spoter.config', 'ngResource', 'angular-data.DSCacheFactory'])

// RESOURCES: Definimos los recursos que se comunicarán con el REST API ##########################################################

// Resource/Model: CATEGORIES 
.factory('SpoterCategories', ['$resource', 'appConfig', 'DSCacheFactory', function($resource, appConfig, DSCacheFactory) {

	var cache = DSCacheFactory('spoterCategoriesCache', {
		maxAge: 3600000, // Una hora de cache
		deleteOnExpire: 'aggressive',
		storageMode: 'localStorage',
		onExpire: function(key) {}
	});

	var resource = $resource(
		appConfig.api.endpoint + '/api/categories/:id', {
			id: '@id'
		}, {
			query: {
				method: 'GET',
				cache: cache,
				isArray: true
			},
			get: {
				method: 'GET',
				cache: cache,
				isArray: true
			},
			getFetured: {
				method: 'GET',
				params: {
					featured: true
				},
				cache: false,
				isArray: true
			}
		});

	resource.clearCache = function() {
		console.log("Eliminando cache de Categorias...");
		return cache.removeAll();
	}


	return resource;
}])