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
				'<input type="search" placeholder="Buscar" ng-model="search.keyword" ng-enter="doSearch(search.keyword)" focus>',
				'</label>',
				'<i class="icon ion-ios-search-strong btn-search" ng-click="doSearch(search.keyword)" ></i>',
				'</div><div class="backdrop" ng-click="searchBoxHide()"></div></div>'
			].join(''),
			replace: true,
			scope: {
				searchFunction: '&'
			},
			controller: function($scope, $attrs) {
				$scope.showbox = false;
				$scope.focus = true;
				$scope.search = {
					keyword: ''
				};
				$scope.$parent.searchBoxShow = function() {
					$scope.showbox = true;
				};
				$scope.$parent.searchBoxHide = function() {
					$scope.showbox = false;
				};
				$scope.$parent.doSearch = function(keyword) {
					$scope.$parent.searchFunction(keyword);
					$scope.$parent.searchBoxHide();
				};
			},
			link: function($scope, $element, $attrs) {
				$scope.keyword = "";
			}
		};
	})
	.directive('focus', function($timeout, $parse) {
		return {
			scope: {
				focus: '@'
			},
			link: function(scope, element) {
				function doFocus() {
					$timeout(function() {
						element[0].focus();
					});
				}
				if (scope.focus != null) {
					// focus unless attribute evaluates to 'false'
					if (scope.focus !== 'false') {
						doFocus();
					}
					// focus if attribute value changes to 'true'
					scope.$watch('focus', function(value) {
						if (value === 'true') {
							doFocus();
						}
					});
				} else {
					// if attribute value is not provided - always focus
					doFocus();
				}

			}
		};
	})
	.directive('ngEnter', function() {
		return function(scope, element, attrs) {
			element.bind("keydown keypress", function(event) {
				if (event.which === 13) {
					scope.$apply(function() {
						scope.$eval(attrs.ngEnter);
					});

					event.preventDefault();
				}
			});
		};
	})
	.directive('collapsibleElement', function($compile, $ionicScrollDelegate) {
		return {
			restrict: 'A',
			replace: false,
			scope: {
				collapsibleElement: '@',
			},
			controller: function($scope, $element) {
				$scope.descriptionExpanded = false;
				$scope.collapsibleElementAvail = false;
				if (!angular.isNumber($scope.collapsibleElement) || $scope.collapsibleElement <= 0)
					$scope.collapsibleElement = 250;
				$scope.toggleDescription = function() {
					$scope.descriptionExpanded = !$scope.descriptionExpanded;
					angular.element($element).removeClass('opened');
					$ionicScrollDelegate.resize();
					if ($scope.descriptionExpanded) {
						angular.element($element).addClass('opened');
						angular.element($element).css('max-height', "none");
					} else {
						$ionicScrollDelegate.scrollTop(true);
						angular.element($element).css('max-height', $scope.collapsibleElement + "px");
					}
				};
				$scope.$watch(function() {
					return $element[0].offsetHeight;
				}, function(newValue, oldValue) {
					if (newValue > $scope.collapsibleElement) {
						$element.addClass('collapsible-element');
						$element.css('max-height', $scope.collapsibleElement + "px");
						$scope.collapsibleElementAvail = true;
					}

				});
			},
			link: function($scope, $element, $attrs) {
				var template = '<span class="more" ng-click="toggleDescription()" ng-show="collapsibleElementAvail"><i class="icon ion-chevron-down" ng-show="!descriptionExpanded"></i><i class="icon ion-chevron-up" ng-show="descriptionExpanded"></i></span>';
				var linkFn = $compile(template);
				var content = linkFn($scope);
				$element.append(content);
			}
		}
	})