(function() {
  'use strict';

  // An adaptation of ngTouch.$swipe
  // basically the same despite of:
  // 1) It is based on 'mobile-angular-ui.gestures.touch'
  // 2) It does not require ngTouch thus is better compatible with fastclick.js 
  // 3) It allows to unbind
  var module = angular.module('mobile-angular-ui.gestures.swipe', 
    ['mobile-angular-ui.gestures.touch']);

  module.factory('$swipe', ['$touch', function($touch) {
    return {
      bind: function(element, eventHandlers, pointerTypes) {
        var options = {
          pointerTypes: pointerTypes,
          movementThreshold: 10,
          preventScroll: function(t) {
            return t.totalY <= t.totalX;
          }  
        };
        return $touch.bind(element, eventHandlers, options);
      }
    };
  }]);

  // Same that for ng-swipe-left/ng-swipe-right but allows for nesting
  // Only inner directive will trigger swipe handler
  var makeSwipeDirective = function(directiveName, direction, eventName) {
    module.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
      // The maximum vertical delta for a swipe should be less than 75px.
      var MAX_VERTICAL_DISTANCE = 75;
      // Vertical distance should not be more than a fraction of the horizontal distance.
      var MAX_VERTICAL_RATIO = 0.3;
      // At least a 30px lateral motion is necessary for a swipe.
      var MIN_HORIZONTAL_DISTANCE = 30;

      return function(scope, element, attr) {
        var swipeHandler = $parse(attr[directiveName]);

        var startCoords, valid;

        function validSwipe(coords) {
          // Check that it's within the coordinates.
          // Absolute vertical distance must be within tolerances.
          // Horizontal distance, we take the current X - the starting X.
          // This is negative for leftward swipes and positive for rightward swipes.
          // After multiplying by the direction (-1 for left, +1 for right), legal swipes
          // (ie. same direction as the directive wants) will have a positive delta and
          // illegal ones a negative delta.
          // Therefore this delta must be positive, and larger than the minimum.
          if (!startCoords) { return false; }
          var deltaY = Math.abs(coords.y - startCoords.y);
          var deltaX = (coords.x - startCoords.x) * direction;
          return valid && // Short circuit for already-invalidated swipes.
              deltaY < MAX_VERTICAL_DISTANCE &&
              deltaX > 0 &&
              deltaX > MIN_HORIZONTAL_DISTANCE &&
              deltaY / deltaX < MAX_VERTICAL_RATIO;
        }

        var pointerTypes = ['touch'];
        if (!angular.isDefined(attr.ngSwipeDisableMouse)) {
          pointerTypes.push('mouse');
        }
        $swipe.bind(element, {
          start: function(coords) {
            startCoords = coords;
            valid = true;
          },
          cancel: function() {
            valid = false;
          },
          end: function(coords, event) {
            // makes nested swipes work:
            if (!event.__UiSwipeHandled__) {
              event.__UiSwipeHandled__ = true;
              if (validSwipe(coords)) {
                scope.$apply(function() {
                  element.triggerHandler(eventName);
                  swipeHandler(scope, {$event: event});
                });
              }
            }
          }
        }, pointerTypes);
      };
    }]);
  };

  // Left is negative X-coordinate, right is positive.
  makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
  makeSwipeDirective('ngSwipeRight', 1, 'swiperight');
}());



