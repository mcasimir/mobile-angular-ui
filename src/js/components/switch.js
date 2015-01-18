/**
@module mobile-angular-ui.components.switch
@description

The `ui-switch` directive (not to be confused with `ng-switch`) lets you create a toggle switch control bound to a boolean `ngModel` value.

<figure class="full-width-figure">
  <img src="/assets/img/figs/switch.png" alt=""/>
</figure>

It requires `ngModel`. You can also use `ngChange` in conjunction with `[switch]` to trigger functions in response to model changes.

``` html
<ui-switch  ng-model="invoice.paid"></ui-switch>
```

*/
(function() {
  'use strict';  
  angular.module('mobile-angular-ui.components.switch', [])
  .directive("uiSwitch", function() {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        model: "=ngModel",
        changeExpr: "@ngChange",
        disabled: "@"
      },
      template: "<div class='switch' ng-class='{active: model}'><div class='switch-handle'></div></div>",
      link: function(scope, elem, attrs) {

        elem.on('click tap', function(){
          if (attrs.disabled === null || attrs.disabled === undefined) {
            scope.model = !scope.model;
            scope.$apply();

            if (scope.changeExpr !== null && scope.changeExpr !== undefined) {
              scope.$parent.$eval(scope.changeExpr);
            }
          }
        });

        elem.addClass('switch-transition-enabled');
      }
    };
  });
}());