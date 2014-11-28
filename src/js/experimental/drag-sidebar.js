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
            var activeClass = 'sidebar-' + side + '-in sidebar-' + side + '-visible';

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
  
  // if $drag is available setup drag to open
  var dragAvailable = true;
  try { angular.module('mobile-angular-ui.drag'); } catch(err) { dragAvailable = false; }

  if (dragAvailable) {
    module.directive('app', ['$drag', '$rootScope', 'SharedState', function($drag, $rootScope, SharedState) {
      return {
        restrict: 'C',
        compile: function(elem) {
          var body = angular.element(document.body),
          leftSidebar = document.getElementsByClassName('sidebar-left'),
          rightSidebar = document.getElementsByClassName('sidebar-right'),
          open, startR, onEnd = function() {    
            $rootScope.$apply(function() {
              if (open === 'left') {
                SharedState.turnOff('sidebarRight');
                SharedState.turnOn('sidebarLeft');
              } else if (open === 'right') {
                SharedState.turnOff('sidebarLeft');
                SharedState.turnOn('sidebarRight');
              } else {
                SharedState.turnOff('sidebarLeft');
                SharedState.turnOff('sidebarRight');
              }              
            });
            $drag.Transform.setElementTransformProperty(elem, null);
            var onTransitionEnd = function() {
              elem[0].removeEventListener('transitionend', onTransitionEnd);
            };
            elem[0].addEventListener('transitionend', onTransitionEnd, false);

            open = null;
          };

          $drag.bind(elem, {
            constraint: { 
              minY: 0, 
              maxY: 0,
              maxX: function() {
                var maxx = (leftSidebar.length ? leftSidebar[0].clientWidth || 1 : 1) - (startR ? startR.left : 0);
                console.log('maxX', maxx);
                return maxx;
              },
              minX: function() {
                var minx = -(rightSidebar.length ? rightSidebar[0].clientWidth || 1 : 1) - (startR ? startR.left : 0);
                console.log('minX', minx);
                return minx;
              }
            },
            start: function(rect, cancel, reset) {
              startR = rect;
              open = null;
            },
            move: function(rect, cancel, reset) {
              if (rect.left > 100) {
                open = 'left';
              } else if (rect.left < -100) {
                open = 'right';
              } else {
                open = null;  
              }

              if (rect.left > 0) {
                body.addClass('sidebar-left-visible');
                body.removeClass('sidebar-right-visible');
              } else if (rect.left < 0) {
                body.addClass('sidebar-right-visible');
                body.removeClass('sidebar-left-visible sidebar-left-in');
              } else {
                body.removeClass('sidebar-right-visible sidebar-left-visible');
              }
            },
            end: onEnd,
            cancel: onEnd
          });
        }
      };
    }]);
  }

}());