/**
 *
 * @module mobile-angular-ui.core.outerClick
 * @description
 *
 * Provides a directive to specifiy a behaviour when click/tap events
 * happen outside an element. This can be easily used
 * to implement eg. __close on outer click__ feature for a dropdown.
 *
 * ## Usage
 *
 * Declare it as a dependency to your app unless you have already
 * included some of its super-modules.
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui']);
 * ```
 *
 * Or
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui.core']);
 * ```
 *
 * Or
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui.core.outerClick']);
 * ```
 *
 * Use `ui-outer-click` to define an expression to evaluate when an _Outer Click_ event happens.
 * Use `ui-outer-click-if` parameter to define a condition to enable/disable the listener.
 *
 * ``` html
 * <div class="btn-group">
 *   <a ui-turn-on='myDropdown' class='btn'>
 *     <i class="fa fa-ellipsis-v"></i>
 *   </a>
 *   <ul
 *     class="dropdown-menu"
 *     ui-outer-click="Ui.turnOff('myDropdown')"
 *     ui-outer-click-if="Ui.active('myDropdown')"
 *     role="menu"
 *     ui-show="myDropdown"
 *     ui-shared-state="myDropdown"
 *     ui-turn-off="myDropdown">
 *
 *     <li><a>Action</a></li>
 *     <li><a>Another action</a></li>
 *     <li><a>Something else here</a></li>
 *     <li class="divider"></li>
 *     <li><a>Separated link</a></li>
 *   </ul>
 * </div>
 * ```
 */
(function() {
  'use strict';

  angular.module('mobile-angular-ui.core.outerClick', [])

    .factory('_mauiIsAncestorOrSelf', function() {
      return function(element, target) {
        var parent = element;
        while (parent.length > 0) {
          if (parent[0] === target[0]) {
            parent = null;
            return true;
          }
          parent = parent.parent();
        }
        parent = null;
        return false;
      };
    })

  /**
   * @service bindOuterClick
   * @as function
   *
   * @description
   * This is a service function that binds a callback to be conditionally executed
   * when a click event happens outside a specified element.
   *
   * Ie.
   *
   * ``` js
   * app.directive('myDirective', function('bindOuterClick'){
   *   return {
   *     link: function(scope, element) {
   *       bindOuterClick(element, function(scope, extra){
   *         alert('You clicked ouside me!');
   *       }, function(e){
   *         return element.hasClass('disabled') ? true : false;
   *       });
   *     }
   *   };
   * });
   * ```
   * @scope {scope} the scope to eval callbacks
   * @param {DomElement|$element} element The element to bind to.
   * @param {function} callback A `function(scope, options)`, usually the result of `$parse`, that is called when an _outer click_ event happens.
   * @param {string|function} condition Angular `$watch` expression to decide whether to run `callback` or not.
   */
    .factory('bindOuterClick', [
      '$document',
      '$timeout',
      '_mauiIsAncestorOrSelf',
      function($document, $timeout, isAncestorOrSelf) {

        return function(scope, element, outerClickFn, outerClickIf) {
          var handleOuterClick = function(event) {
            if (!isAncestorOrSelf(angular.element(event.target), element)) {
              scope.$apply(function() {
                outerClickFn(scope, {$event: event});
              });
            }
          };

          var stopWatching = angular.noop;
          var t = null;

          if (outerClickIf) {
            stopWatching = scope.$watch(outerClickIf, function(value) {
              $timeout.cancel(t);

              if (value) {
               // prevents race conditions
               // activating with other click events
                t = $timeout(function() {
                  $document.on('click tap', handleOuterClick);
                }, 0);

              } else {
                $document.unbind('click tap', handleOuterClick);
              }
            });
          } else {
            $timeout.cancel(t);
            $document.on('click tap', handleOuterClick);
          }

          scope.$on('$destroy', function() {
            stopWatching();
            $document.unbind('click tap', handleOuterClick);
          });
        };
      }
    ])

  /**
   * @directive outerClick
   *
   * @description
   * Evaluates an expression when an _Outer Click_ event happens.
   *
   * @param {expression} uiOuterClick Expression to evaluate when an _Outer Click_ event happens.
   * @param {expression} uiOuterClickIf Condition to enable/disable the listener. Defaults to `true`.
   */
    .directive('uiOuterClick', [
      'bindOuterClick',
      '$parse',
      function(bindOuterClick, $parse) {
        return {
          restrict: 'A',
          compile: function(elem, attrs) {
            var outerClickFn = $parse(attrs.uiOuterClick);
            var outerClickIf = attrs.uiOuterClickIf;
            return function(scope, elem) {
              bindOuterClick(scope, elem, outerClickFn, outerClickIf);
            };
          }
        };
      }
    ]);
})();
