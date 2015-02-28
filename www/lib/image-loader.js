/**
 * Localia Image Loader
 * Created by Leo
 */
angular.module('imageLoader', []);
angular.module('imageLoader')
	.directive('imageLoaderScroll', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'A',
				link: function($scope, $element) {

					var scrollTimeoutId = 0;

					$scope.invoke = function() {
						$rootScope.$broadcast('imageLoaderOnScroll');
					};

					$element.bind('scroll', function() {
						$timeout.cancel(scrollTimeoutId);
						scrollTimeoutId = $timeout($scope.invoke, 0);
					});


				}
			};
		}
	])
	.directive('imageLoaderBackground', ['$timeout', '$document', '$compile', function($timeout, $document, $compile) {
		return {
			restrict: 'A',
			replace: false,
			link: function(scope, element, attributes) {
				var lazyTolerance = 150;
				var template = '<div class="image-content" style="background-image: url({{backgrounImage}}); opacity: {{opacity}}"></div>';
				scope.opacity = 0;

				function placeImage(src) {
					scope.backgrounImage = src;
					scope.opacity = 1;
					element[0].style.backgroundImage = "none";
				}

				function isInView() {
					var clientHeight = $document[0].documentElement.clientHeight;
					var clientWidth = $document[0].documentElement.clientWidth;
					var imageRect = element[0].getBoundingClientRect();
					return (imageRect.bottom <= (clientHeight + lazyTolerance) && imageRect.right <= clientWidth);
				}

				var unregister = scope.$on('imageLoaderOnScroll', function() {
					if (isInView()) {
						placeImage(attributes.imageLoaderBackground);
						unregister();
					}
				});
				element.on('$destroy', function() {
					unregister();
				});
				$timeout(function() {
					if (attributes.hasOwnProperty('imageLoaderLazy')) {
						if (isInView()) {
							placeImage(attributes.imageLoaderBackground);
							unregister();
						}
					} else {
						placeImage(attributes.imageLoaderBackground);
						unregister();
					}

				}, 500);
				var linkFn = $compile(template);
				var content = linkFn(scope);
				element.append(content);
			}
		}
	}])