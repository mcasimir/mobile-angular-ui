/**
 * A module providing swipe gesture services and directives.
 * 
 * @module mobile-angular-ui.gestures.swipe 
 */
(function() {
  'use strict';

  var module = angular.module('mobile-angular-ui.gestures.swipe', 
    ['mobile-angular-ui.gestures.touch']);

  /**
   * An adaptation of `ngTouch.$swipe`, it is basically the same despite of:
   * 
   * - It is based on [$touch](../module:touch)
   * - Swipes are recognized by touch velocity and direction
   * - It does not require `ngTouch` thus is better compatible with fastclick.js 
   * - Swipe directives are nestable
   * - It allows to unbind
   * - It has only one difference in interface, and its about how to pass `pointerTypes`:
   * 
   *   ``` js
   *     // ngTouch.$swipe
   *     $swipe.bind(..., ['mouse', ... }); 
   * 
   *     // mobile-angular-ui.gestures.swipe.$swipe
   *     $swipe.bind(..., pointerTypes: { mouse: { start: 'mousedown', ...} });
   *   ```
   *   This is due to the fact that the second parameter of `$swipe.bind` is destinated to options for
   *   underlying `$touch` service.
   *   
   * @service $swipe
   * @as class
   */
  module.factory('$swipe', ['$touch', function($touch) {
    var VELOCITY_THRESHOLD = 500; // px/sec
    var MOVEMENT_THRESHOLD = 10; // px
    var TURNAROUND_MAX = 10; // px
    var ANGLE_THRESHOLD = 10; // deg
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
      /**
       * Bind swipe gesture handlers for an element.
       *
       * ``` js
       * var unbind = $swipe.bind(elem, { 
       *   end: function(touch) { 
       *     console.log('Swiped:', touch.direction);
       *     unbind();
       *   }
       * });
       * ```
       * 
       * **Swipes Detection**
       *
       * Before consider a touch to be a swipe Mobile Angular UI verifies that:
       *
       * 1. Movement is quick. Average touch velocity should exceed a `VELOCITY_THRESHOLD`.
       * 2. Movement is linear.
       * 3. Movement has a clear, non-ambiguous direction. So we can assume without error
       *    that underlying `touch.direction` is exactly the swipe direction. For that
       *    movement is checked against an `ANGLE_THRESHOLD`.
       * 
       * @param  {Element|$element} element The element to observe for swipe gestures.
       * @param  {object} eventHandlers An object with handlers for specific swipe events.
       * @param  {function} [eventHandlers.start]  The callback for swipe start event.
       * @param  {function} [eventHandlers.end]  The callback for swipe end event.
       * @param  {function} [eventHandlers.move]  The callback for swipe move event.
       * @param  {function} [eventHandlers.cancel]  The callback for swipe cancel event.
       * @param  {object} [options] Options to be passed to underlying [$touch.bind](../module:touch) function.
       * 
       * @returns {function} The unbind function.
       * 
       * @method bind
       * @memberOf mobile-angular-ui.gestures.swipe~$swipe
       */
      bind: function(element, eventHandlers, options) {
        options = angular.extend({}, defaultOptions, options || {});
        return $touch.bind(element, eventHandlers, options);
      }
    };
  }]);
  
  /**
   * Specify custom behavior when an element is swiped to the left on a touchscreen device. 
   * A leftward swipe is a quick, right-to-left slide of the finger.
   * 
   * @directive uiSwipeLeft
   * @param {expression} uiSwipeLeft An expression to be evaluated on leftward swipe.
   */
  /**
   * Specify custom behavior when an element is swiped to the right on a touchscreen device. 
   * A rightward swipe is a quick, left-to-right slide of the finger.
   * 
   * @directive uiSwipeRight
   * @param {expression} uiSwipeRight An expression to be evaluated on rightward swipe.
   */
  /**
   * Alias for [uiSwipeLeft](#uiswipeleft).
   * 
   * @directive ngSwipeLeft
   * @deprecated
   */
  /**
   * Alias for [uiSwipeRight](#uiswiperight).
   * 
   * @directive ngSwipeRight
   * @deprecated
   */
  angular.forEach(['ui', 'ng'], function(prefix) {
    angular.forEach(['Left', 'Right'], function(direction) {
      var directiveName = prefix + 'Swipe' + direction;
      module.directive(directiveName, ['$swipe', '$parse', function($swipe, $parse){
        return {
          link: function(scope, elem, attrs) {
            var onSwipe = $parse(attrs[directiveName]);
            $swipe.bind(elem, {
              end: function(swipe, event) {
                if (swipe.direction === direction.toUpperCase()) {
                  if (!event.__UiSwipeHandled__) {
                    event.__UiSwipeHandled__ = true;
                    scope.$apply(function() {
                      onSwipe(scope, {$touch: swipe});
                    });
                  }
                }
              }
            });
          }
        };
      }]);
    });
  });
}());