angular.module('localia.directives', [])
	.directive('headerScrollFade', function($document) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var header = $document[0].body.querySelector('.' + attrs.headerScrollHeader);
				var reference = $document[0].body.querySelector('.' + attrs.headerScrollReference);
				var threshold = 30;

				angular.element(header).css("opacity", 0);

				element.bind('scroll', function(e) {
					var rh = reference.offsetHeight;
					var hh = header.offsetHeight;

					var offset = (e.detail.scrollTop + hh + threshold) - rh;
					offset /= threshold;
					if (offset < 0) offset = 0;
					if (offset > 1) offset = 1;
					angular.element(header).css("opacity", offset);
				});
			}
		}
	})
	.directive('searchBox', function() {
		return {
			restrict: 'E',
			template: [
				'<div class="search-box" ng-if="showbox"><div class="box">',
				'<i class="icon ion-android-arrow-back btn-back" ng-click="searchBoxHide()"></i>',
				'<label class="item item-input">',
				'<input type="search" placeholder="Buscar" ng-model="search.keyword" >',
				'</label>',
				'<i class="icon ion-ios-search-strong btn-search" ng-click="doSearch()" ></i>',
				'</div><div class="backdrop" ng-click="searchBoxHide()"></div></div>'
			].join(''),
			replace: true,
			scope: {
				searchFunction: '&'
			},
			controller: function($scope, $attrs) {
				$scope.showbox = false;
				$scope.search = {
					keyword: ''
				};
				$scope.$parent.searchBoxShow = function() {
					$scope.showbox = true;
				};
				$scope.$parent.searchBoxHide = function() {
					$scope.showbox = false;
				};
				$scope.doSearch = function() {
					console.log("Buscar: " + $scope.search.keyword);
					searchFunction();
				}
			},
			link: function(scope, element, attrs) {
				console.log(element);
			}
		};
	});