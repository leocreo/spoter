angular.module('spoter.controllers', [])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', 'appConfig', 'SpoterCategories', '$location', function($scope, appConfig, SpoterCategories, $location) {
	$scope.currentCityName = "Villa General Belgrano";

	//SpoterCategories.clearCache();
	$scope.categories = SpoterCategories.query();

	$scope.goCategory = function(id) {
		var path = '/categories';
		if (id !== undefined && id !== null)
			path += "/" + id;
		$location.path(path);
	}

}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$scope', 'appConfig', 'SpoterCategories', function($scope, appConfig, SpoterCategories) {

	//SpoterCategories.clearCache();
	$scope.featuredCategories = SpoterCategories.getFetured();

}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$scope', '$stateParams', 'appConfig', 'SpoterCategories', function($scope, $stateParams, appConfig, SpoterCategories) {

	$scope.goCategory = function(id) {
		var path = '/categories';
		if (id !== undefined && id !== null)
			path += "/" + id;
		$location.path(path);
	}

	//SpoterCategories.clearCache();
	SpoterCategories.get({}, {
		//id: $stateParams.id
	}, function() {
		$scope.name = "Gastronomía";
	});

}])