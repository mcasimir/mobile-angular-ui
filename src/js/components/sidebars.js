/**
@module mobile-angular-ui.components.sidebars

@description

Sidebars can be placed either in left side or right side adding respectively `.sidebar-left` and `.sidebar-right` classes.

``` html
<div class="sidebar sidebar-left">
  <div class="scrollable">
    <h1 class="scrollable-header app-name">My App</h1>  
    <div class="scrollable-content">
      <div class="list-group" ui-turn-off='uiSidebarLeft'>
        <a class="list-group-item" href="#/link1">Link 1 
          <i class="fa fa-chevron-right pull-right"></i></a>
        <a class="list-group-item" href="#/link2">Link 2
          <i class="fa fa-chevron-right pull-right"></i></a>
      </div>
    </div>
  </div>
</div>

<div class="sidebar sidebar-rigth">
  <!-- -->
</div>
```

#### Interacting with sidebars

Under the hood sidebar uses `SharedState` exposing respective statuses: `uiSidebarLeft` and `uiSidebarRight` unless you define different state name through `id` attribute on sidebar elements.

``` html
<a href ui-toggle='uiSidebarLeft'>Toggle sidebar left</a>

<a href ui-toggle='uiSidebarRight'>Toggle sidebar right</a>
```

You can put `ui-turn-off='uiSidebarLeft'` or `ui-turn-off='uiSidebarLeft'` inside the sidebar to make it close after clicking links inside them.

By default sidebar are closed by clicking/tapping outside them.

*/
(function() {
  'use strict';

  var module = angular.module(
    'mobile-angular-ui.components.sidebars', [
      'mobile-angular-ui.core.sharedState',
      'mobile-angular-ui.core.outerClick'
    ]
  );

  angular.forEach(['left', 'right'], function (side) {
    var directiveName = 'sidebar' + side.charAt(0).toUpperCase() + side.slice(1);
    var stateName = 'ui' + directiveName.charAt(0).toUpperCase() + directiveName.slice(1);

    module.directive(directiveName, [
      '$rootElement',
      'SharedState',
      'bindOuterClick',
      '$location',
      function (
        $rootElement,
        SharedState,
        bindOuterClick,
        $location
      ) {  
        return {
          restrict: 'C',
          link: function (scope, elem, attrs) {
            var parentClass = 'has-sidebar-' + side;
            var visibleClass = 'sidebar-' + side + '-visible';
            var activeClass = 'sidebar-' + side + '-in';

            if (attrs.id) {
              stateName = attrs.id;
            }

            var outerClickCb = function (){
              SharedState.turnOff(stateName);
            };

            var outerClickIf = function() {
              return SharedState.isActive(stateName);
            };

            $rootElement.addClass(parentClass);
            scope.$on('$destroy', function () {
              $rootElement
                .removeClass(parentClass);
              $rootElement
                .removeClass(visibleClass);
              $rootElement
                .removeClass(activeClass);
            });

            var defaultActive = attrs.active !== undefined && attrs.active !== 'false';          
            SharedState.initialize(scope, stateName, {defaultValue: defaultActive});

            scope.$on('mobile-angular-ui.state.changed.' + stateName, function (e, active) {
              if (attrs.uiTrackAsSearchParam === '' || attrs.uiTrackAsSearchParam) {
                $location.search(stateName, active || null);
              }
              
              if (active) {
                $rootElement
                  .addClass(visibleClass);
                $rootElement
                  .addClass(activeClass);
              } else {
                $rootElement
                  .removeClass(activeClass);
                // Note: .removeClass(visibleClass) is called on 'mobile-angular-ui.app.transitionend'
              }
            });

            scope.$on('$routeChangeSuccess', function() {
              SharedState.turnOff(stateName);
            });

            scope.$on('$routeUpdate', function() {
              if (attrs.uiTrackAsSearchParam) {
                if (($location.search())[stateName]) {
                  SharedState.turnOn(stateName);
                } else {
                  SharedState.turnOff(stateName);
                }                
              }
            });

            scope.$on('mobile-angular-ui.app.transitionend', function() {
              if (!SharedState.isActive(stateName)) {
                $rootElement.removeClass(visibleClass);  
              }
            });

            if (attrs.closeOnOuterClicks !== 'false') {
              bindOuterClick(scope, elem, outerClickCb, outerClickIf);
            }
          }
        };
      }
    ]);
  });

  module.directive('app', ['$rootScope', function($rootScope) {
    return {
      restrict: 'C',
      link: function(scope, element) {
        
        element.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
          $rootScope.$broadcast('mobile-angular-ui.app.transitionend');
        });          

      }
    };
  }]);
}());