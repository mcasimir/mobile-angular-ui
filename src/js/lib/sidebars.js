var module = angular.module(
  'mobileAngularUi.sidebars', [
    'mobileAngularUi.sharedState',
    'mobileAngularUi.outerClick'
  ]
);

angular.forEach(['left', 'right'], function (side) {
  var directiveName = 'sidebar' + side.charAt(0).toUpperCase() + side.slice(1);
  module.directive(directiveName,
    function (
      $rootElement,
      SharedState,
      bindOuterClick
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

          scope.$on('mobileAngularUi.state.changed.' + directiveName, function (e, active) {
            if (active) {
              $rootElement
                .addClass(activeClass);
            } else {
              $rootElement
                .removeClass(activeClass);
            }
          });

          scope.$on('$locationChangeSuccess', function () {
            SharedState.turnOff(directiveName);
          });

          scope.$on('$destroy', function () {
            $rootElement
              .removeClass(parentClass);
            $rootElement
              .removeClass(activeClass);
          });

          var defaultActive = attrs.active !== undefined && attrs.active !== 'false';          
          SharedState.initialize(scope, directiveName, defaultActive);

          if (attrs.closeOnOuterClicks !== 'false') {
            bindOuterClick(scope, elem, outerClickCb, outerClickIf);
          }
        }
      };
    });
});