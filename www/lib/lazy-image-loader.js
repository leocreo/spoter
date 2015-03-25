/**
 * Localia Image Loader
 * Created by Leo
 */
angular.module('lazyImageLoader', []);
angular.module('lazyImageLoader')
	.directive('lazyImageScroll', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'A',
				link: function($scope, $element) {

					var scrollTimeoutId = 0;

					$scope.invoke = function() {
						$rootScope.$broadcast('lazyImageLoader:scroll');
					};

					$element.bind('scroll', function() {
						$timeout.cancel(scrollTimeoutId);
						scrollTimeoutId = $timeout($scope.invoke, 0);
					});


				}
			};
		}
	])
	.directive('lazyImageBackground', ['$timeout', '$document', '$compile', function($timeout, $document, $compile) {
		return {
			restrict: 'A',
			replace: false,
			scope: {
				lazyImageBackground: '@',
				lazyImageOpacity: '@'
			},
			link: function(scope, element, attributes) {
				var lazyTolerance = 150;
				var template = '<div class="lazy-image-background-content" style="background-image: url({{backgrounImage}}); opacity: {{opacity}}"></div>';
				scope.opacity = 0;

				function preloadImage(src) {
					var image = new Image();
					image.onload = function(event) {
						if (angular.isUndefined(attributes.lazyImageOpacity))
							attributes.lazyImageOpacity = 1;
						element[0].querySelector(".lazy-image-background-content").style.opacity = attributes.lazyImageOpacity;
						//element[0].style.backgroundImage = "none";
					};
					image.src = src;
					scope.backgrounImage = src;
					if (image.complete) image.onload();
				}


				function isInView() {
					if (angular.isUndefined($document[0].documentElement.clientHeight) || angular.isUndefined($document[0].documentElement.clientWidth))
						return true; // Fallback, siempre muestra.
					var clientHeight = $document[0].documentElement.clientHeight;
					var clientWidth = $document[0].documentElement.clientWidth;
					var imageRect = element[0].getBoundingClientRect();
					return (imageRect.bottom <= (clientHeight + lazyTolerance)); // Solo chequeamos horizontalmente
				}

				var unregister = scope.$on('lazyImageLoader:scroll', function() {
					if (isInView()) {
						preloadImage(attributes.lazyImageBackground);
						unregister();
					}
				});
				element.on('$destroy', function() {
					unregister();
				});
				$timeout(function() {
					if (attributes.hasOwnProperty('lazy-image-show')) {
						preloadImage(attributes.lazyImageBackground);
						unregister();
					} else {
						if (isInView()) {
							preloadImage(attributes.lazyImageBackground);
							unregister();
						}
					}
				}, 500);
				attributes.$observe('lazyImageBackground', function(newSrc) {
					scope.opacity = 0;
					scope.backgrounImage = '';
					preloadImage(newSrc);
				});
				var linkFn = $compile(template);
				var content = linkFn(scope);
				element.append(content);
			}
		}
	}])