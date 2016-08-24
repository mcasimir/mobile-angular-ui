/**
 * A module with just a directive to create a switch input component.
 *
 * @module mobile-angular-ui.components.switch
 */
(function() {
  'use strict';
  angular.module('mobile-angular-ui.components.switch', [])

  /**
   * @directive uiSwitch
   * @restrict EA
   * @requires ngModel
   * @description
   *
   * The `ui-switch` directive (not to be confused with `ng-switch`) lets
   * you create a toggle switch control bound to a boolean `ngModel` value.
   *
   * <figure class="full-width-figure">
   *   <img src="/assets/img/figs/switch.png" alt=""/>
   * </figure>
   *
   * It requires `ngModel`. It supports `ngChange` and `ngDisabled`.
   *
   * ``` html
   * <ui-switch  ng-model="invoice.paid"></ui-switch>
   * ```
   *
   * ``` html
   * <ui-switch  ng-model="invoice.paid" disabled></ui-switch>
   * ```
   *
   * ``` html
   * <ui-switch  ng-model="invoice.paid" ng-disabled='{{...}}'></ui-switch>
   * ```
   *
   * Note that if `$drag` service from `mobile-angular-ui.gestures` is available
   * `ui-switch` will support drag too.
   *
   * @param {expression} ngModel The model bound to this component.
   * @param {boolean} [disabled] Whether this component should be disabled.
   * @param {expression} [ngChange] An expression to be evaluated when model changes.
   */
    .directive('uiSwitch', ['$injector', function($injector) {
      var $drag = $injector.has('$drag') && $injector.get('$drag');

      return {
        restrict: 'EA',
        scope: {
          model: '=ngModel',
          changeExpr: '@ngChange'
        },
        link: function(scope, elem, attrs) {
          elem.addClass('switch');

          var disabled = attrs.disabled || elem.attr('disabled');

          var unwatchDisabled = scope.$watch(
          function() {
            return attrs.disabled || elem.attr('disabled');
          },
          function(value) {
            if (!value || value === 'false' || value === '0') {
              disabled = false;
            } else {
              disabled = true;
            }
          }
        );

          var handle = angular.element('<div class="switch-handle"></div>');
          elem.append(handle);

          if (scope.model) {
            elem.addClass('active');
          }
          elem.addClass('switch-transition-enabled');

          var unwatch = scope.$watch('model', function(value) {
            if (value) {
              elem.addClass('active');
            } else {
              elem.removeClass('active');
            }
          });

          var setModel = function(value) {
            if (!disabled && (value !== scope.model)) {
              scope.model = value;
              scope.$apply();
              if (scope.changeExpr !== null && scope.changeExpr !== undefined) {
                scope.$parent.$eval(scope.changeExpr);
              }
            }
          };

          var clickCb = function() {
            setModel(!scope.model);
          };

          elem.on('click tap', clickCb);

          var unbind = angular.noop;

          if ($drag) {
            unbind = $drag.bind(handle, {
              transform: $drag.TRANSLATE_INSIDE(elem),
              start: function() {
                elem.off('click tap', clickCb);
              },
              cancel: function() {
                handle.removeAttr('style');
                elem.off('click tap', clickCb);
                elem.on('click tap', clickCb);
              },
              end: function() {
                var rh = handle[0].getBoundingClientRect();
                var re = elem[0].getBoundingClientRect();
                if (rh.left - re.left < rh.width / 3) {
                  setModel(false);
                  handle.removeAttr('style');
                } else if (re.right - rh.right < rh.width / 3) {
                  setModel(true);
                  handle.removeAttr('style');
                } else {
                  handle.removeAttr('style');
                }
                elem.on('click tap', clickCb);
              }
            });
          }

          elem.on('$destroy', function() {
            unbind();
            unwatchDisabled();
            unwatch();
            setModel = unbind = unwatch = unwatchDisabled = clickCb = null;
          });
        }
      };
    }]);
})();
