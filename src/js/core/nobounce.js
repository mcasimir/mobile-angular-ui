/**
 * Enable prevention of window bounce in IOS.
 *
 * Requiring this module the `touchmove.preventDefault` logic is inverted. 
 * So any `touchmove` default behaviour is automatically prevented.
 * 
 * If you wish to allow the default behaviour, for example to allow 
 * inner elements to scroll, you have to explicitly setup `e.allowTouchmoveDefault` 
 * to `true`.
 *
 * Mobile Angular UI already handles this for `scrollable` elements.
 *
 * You can easily disable this for an element, or under some circumstances through
 * the `allowTouchmoveDefault` service provided in this module.
 * 
 * @module mobile-angular-ui.core.nobounce
 */
(function () {
  'use strict';
  var module = angular.module('mobile-angular-ui.core.nobounce', []);

  if ('ontouchmove' in document) {
    module.run(function() {
      angular.element(document).on('touchmove', function(e) {
        if (e.allowTouchmoveDefault !== true) {
          e.preventDefault();
        }
      });
    });
  }

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
  
  module.factory('allowTouchmoveDefault', function(){
    var fnTrue = function() { return true; };

    if ('ontouchmove' in document) {
        return function($element, condition) {
          condition = condition || fnTrue;

          var allowTouchmoveDefaultCallback = function(e) {
            if (condition(e)) { e.allowTouchmoveDefault = true; }
          };

          $element = angular.element($element);
          $element.on('touchmove',  allowTouchmoveDefaultCallback);

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
    } else {
      return angular.noop;
    }
  });

}());