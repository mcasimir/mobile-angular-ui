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
        
        var outerClickCb = function (scope){
          SharedState.turnOff(stateName);
        };

        var outerClickIf = function() {
          return SharedState.isActive(stateName);
        };
        
        return {
          restrict: 'C',
          link: function (scope, elem, attrs) {
            var parentClass = 'has-sidebar-' + side;
            var visibleClass = 'sidebar-' + side + '-visible';
            var activeClass = 'sidebar-' + side + '-in';

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
                // Note: .removeClass(visibleClass) is called by 'app' directive
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

            if (attrs.closeOnOuterClicks !== 'false') {
              bindOuterClick(scope, elem, outerClickCb, outerClickIf);
            }
          }
        };
      }
    ]);
  });

  module.directive('app', ['$rootElement', 'SharedState', function($rootElement, SharedState) {
    return {
      restrict: 'C',
      link: function(scope, element, attributes) {
        
        element.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
          if (!SharedState.isActive('uiSidebarLeft')) {
            $rootElement.removeClass('sidebar-left-visible');  
          }
          if (!SharedState.isActive('uiSidebarRight')) {
            $rootElement.removeClass('sidebar-right-visible');
          }
        });          

      }
    };
  }]);
}());