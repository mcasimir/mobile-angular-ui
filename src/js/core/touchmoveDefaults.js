/**
 * Provides directives and service to prevent touchmove default behaviour
 * for touch devices (ie. bounce on overscroll in IOS).
 *
 * #### Usage
 *
 * Use `ui-prevent-touchmove-defaults` directive on root element of your app:
 *
 * ``` html
 * <body ng-app='myApp' ui-prevent-touchmove-defaults>
 *   <!-- ... -->
 * </body>
 * ```
 *
 * Doing so `touchmove.preventDefault` logic for inner elements is inverted,
 * so any `touchmove` default behaviour is automatically prevented.
 *
 * If you wish to allow the default behaviour, for example to allow
 * inner elements to scroll, you have to explicitly mark an event to allow
 * touchmove default.
 *
 * Mobile Angular UI already handles this for `scrollable` elements, so you don't have
 * to do anything in order to support scroll.
 *
 * If you wish to allow touchmove defaults for certain element under certain conditions
 * you can use the `allowTouchmoveDefault` service.
 *
 * ie.
 *
 * ``` js
 * // always allow touchmove default for an element
 * allowTouchmoveDefault(myelem);
 * ```
 *
 * ``` js
 * // allow touchmove default for an element only under certain conditions
 * allowTouchmoveDefault(myelem, function(touchmove){
 *   return touchmove.pageY > 100;
 * });
 * ```
 *
 * @module mobile-angular-ui.core.touchmoveDefaults
 */
(function() {
  'use strict';
  var module = angular.module('mobile-angular-ui.core.touchmoveDefaults', []);

  module.directive('uiPreventTouchmoveDefaults', function() {
    var preventTouchmoveDefaultsCb = function(e) {
      // Get this flag from either the saved event if jQuery is being used, otherwise get it from the event itself.
      var allowTouchmoveEventFlag = e.originalEvent ? e.originalEvent.allowTouchmoveDefault : e.allowTouchmoveDefault;
      if (allowTouchmoveEventFlag !== true) {
        e.preventDefault();
      }
    };

    return {
      compile: function(element) {
        if ('ontouchmove' in document) {
          element.on('touchmove', preventTouchmoveDefaultsCb);
        }
      }
    };
  });

  /**
   * Bind a listener to an element to allow `touchmove` default behaviour
   * when `touchmove` happens inside the bound element.
   *
   * You can also provide a function to decide when to allow and
   * when to prevent it.
   *
   * ``` js
   * // always allow touchmove default
   * allowTouchmoveDefault(myelem);
   *
   * // allow touchmove default only under certain conditions
   * allowTouchmoveDefault(myelem, function(touchmove){
   *   return touchmove.pageY > 100;
   * });
   * ```
   *
   * @param {Element|$element} element The element to bind.
   * @param {function} condition A `function(touchmove)⟶boolean` to decide
   *                             whether to allow default behavior or not.
   *
   * @service allowTouchmoveDefault
   * @as function
   * @returns function Function to unbind the listener
   */

  module.factory('allowTouchmoveDefault', function() {
    var fnTrue = function() {
      return true;
    };

    if ('ontouchmove' in document) {
      return function($element, condition) {
        condition = condition || fnTrue;

        var allowTouchmoveDefaultCallback = function(e) {
          if (condition(e)) {
            e.allowTouchmoveDefault = true;
              // jQuery normalizes the event object, need to put this property on the copied originalEvent.
            if (e.originalEvent) {
              e.originalEvent.allowTouchmoveDefault = true;
            }
          }
        };

        $element = angular.element($element);
        $element.on('touchmove', allowTouchmoveDefaultCallback);

        $element.on('$destroy', function() {
          $element.off('touchmove', allowTouchmoveDefaultCallback);
          $element = null;
        });

        return function() {
          if ($element) {
            $element.off('touchmove', allowTouchmoveDefaultCallback);
          }
        };
      };
    }

    return angular.noop;
  });

})();
