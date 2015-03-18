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