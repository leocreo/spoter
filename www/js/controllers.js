angular.module('spoter.controllers', [])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', '$state', 'appGlobals', 'SpoterCategories', function($scope, $state, appGlobals, SpoterCategories) {
	$scope.currentCityName = "Villa General Belgrano";

	//SpoterCategories.clearCache();
	SpoterCategories.findAll().then(function(data) {
		$scope.categories = data;
	});

	$scope.goCategory = function(id) {
		$state.go('app.categories', {
			id: id
		});
	};

}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$scope', '$state', 'appGlobals', 'SpoterCategories', function($scope, $state, appGlobals, SpoterCategories) {

	SpoterCategories.findAll({
		featured: 1
	}).then(function(data) {
		$scope.featuredCategories = data;
	});

}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$scope', '$stateParams', 'appGlobals', 'SpoterCategories', function($scope, $stateParams, appGlobals, SpoterCategories) {

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

	SpoterCategories.findAll({
		parent_id: Number($stateParams.id)
	}).then(function(data) {
		$scope.childrenCategories = data;
	});

}])