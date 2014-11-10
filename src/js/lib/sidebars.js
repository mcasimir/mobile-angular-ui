(function() {
  'use strict';

  var module = angular.module(
    'mobile-angular-ui.sidebars', [
      'mobile-angular-ui.sharedState',
      'mobile-angular-ui.outerClick'
    ]
  );

  angular.forEach(['left', 'right'], function (side) {
    var directiveName = 'sidebar' + side.charAt(0).toUpperCase() + side.slice(1);
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
        
        var outerClickCb = function (scope){
          SharedState.turnOff(directiveName);
        };

        var outerClickIf = function() {
          return SharedState.isActive(directiveName);
        };
        
        return {
          restrict: 'C',
          link: function (scope, elem, attrs) {
            var parentClass = 'has-sidebar-' + side;
            var activeClass = 'sidebar-' + side + '-in';

            $rootElement.addClass(parentClass);
            scope.$on('$destroy', function () {
              $rootElement
                .removeClass(parentClass);
              $rootElement
                .removeClass(activeClass);
            });

            var defaultActive = attrs.active !== undefined && attrs.active !== 'false';          
            SharedState.initialize(scope, directiveName, defaultActive);

            scope.$on('mobile-angular-ui.state.changed.' + directiveName, function (e, active) {
              if (attrs.uiTrackAsSearchParam === '' || attrs.uiTrackAsSearchParam) {
                $location.search(directiveName, active || null);
              }
              
              if (active) {
                $rootElement
                  .addClass(activeClass);
              } else {
                $rootElement
                  .removeClass(activeClass);
              }
            });

            scope.$on('$routeChangeSuccess', function() {
              SharedState.turnOff(directiveName);
            });

            scope.$on('$routeUpdate', function() {
              if (attrs.uiTrackAsSearchParam) {
                if (($location.search())[directiveName]) {
                  SharedState.turnOn(directiveName);
                } else {
                  SharedState.turnOff(directiveName);
                }                
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
}());