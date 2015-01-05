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
    var VELOCITY_THRESHOLD = 1000; // px/sec
    var MOVEMENT_THRESHOLD = 10; // px
    var TURNAROUND_MAX = 10; // px
    var ANGLE_THRESHOLD = 4; // deg
    var abs = Math.abs;

    var defaultOptions = {
      movementThreshold: MOVEMENT_THRESHOLD, // start to consider only if movement 
                                             // exceeded MOVEMENT_THRESHOLD
      valid: function(t) {
        var absAngle = abs(t.angle);
        absAngle = absAngle >= 90 ? absAngle - 90 : absAngle;

        var validDistance = t.total - t.distance <= TURNAROUND_MAX,
            validAngle = absAngle <= ANGLE_THRESHOLD || absAngle >= 90 - ANGLE_THRESHOLD,
            validVelocity = t.averageVelocity >= VELOCITY_THRESHOLD;
        
        return validDistance && validAngle && validVelocity;
      }
    };

    return {
      bind: function(element, eventHandlers, options) {
        options = angular.extend({}, defaultOptions, options || {});
        return $touch.bind(element, eventHandlers, options);
      }
    };
  }]);

  // Same that for ng-swipe-left/ng-swipe-right but allows for nesting
  // Only inner directive will trigger swipe handler
  var makeSwipeDirective = function(directiveName, direction, eventName) {
    module.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {

      return function(scope, element, attr) {
        var swipeHandler = $parse(attr[directiveName]);
        var pointerTypes = ['touch'];
        if (!angular.isDefined(attr.ngSwipeDisableMouse)) {
          pointerTypes.push('mouse');
        }
        var opts = {
          pointerTypes: pointerTypes
        };
        $swipe.bind(element, {
          end: function(coords, event) {
            if (!event.__UiSwipeHandled__) {
              event.__UiSwipeHandled__ = true;
                scope.$apply(function() {
                  element.triggerHandler(eventName);
                  swipeHandler(scope, {$event: event});
                });
              }
            }
          }, opts);
      };
    }]);
  };

  // Left is negative X-coordinate, right is positive.
  makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
  makeSwipeDirective('ngSwipeRight', 1, 'swiperight');
}());