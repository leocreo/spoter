angular.module('spoter.controllers', [])

//############################################################################### 
// Main App Layout Controller 
.controller('AppController', ['$scope', 'appConfig', 'SpoterCategories', '$location', 'appGlobals', function($scope, appConfig, SpoterCategories, $location, appGlobals) {
	$scope.currentCityName = "Villa General Belgrano";

	//SpoterCategories.clearCache();
	appGlobals.categories = SpoterCategories.query();
	$scope.categories = appGlobals.categories;

}])

//############################################################################### 
// Home Front Controller 
.controller('HomeController', ['$scope', 'appConfig', 'SpoterCategories', 'appGlobals', function($scope, appConfig, SpoterCategories, appGlobals) {

	for (var i in appGlobals.categories) {
		if (appGlobals.categories[i].featured == '1')
			$scope.categories.push(appGlobals.categories[i]);
	}
}])

//############################################################################### 
// Categories Controller 
.controller('CategoriesController', ['$scope', '$stateParams', 'appConfig', 'SpoterCategories', function($scope, $stateParams, appConfig, SpoterCategories) {


}])