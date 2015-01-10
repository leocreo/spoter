angular.module('spoter.controllers', [])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', '$state', 'appGlobals', 'SpoterCategories', function($scope, $state, appGlobals, SpoterCategories) {
	$scope.currentCityName = "Villa General Belgrano";

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

}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$scope', '$stateParams', 'appGlobals', 'SpoterCategories', function($scope, $stateParams, appGlobals, SpoterCategories) {

	SpoterCategories.get($stateParams.id).then(function(data) {
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