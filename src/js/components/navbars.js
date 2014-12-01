(function() {
  'use strict';

  var module = angular.module('mobile-angular-ui.components.navbars', []);

  angular.forEach(['top', 'bottom'], function(side) {
    var directiveName = 'navbarAbsolute' + side.charAt(0).toUpperCase() + side.slice(1);
    module.directive(directiveName, [
      '$rootElement',
      function($rootElement) {
        return {
          restrict: 'C',
          link: function(scope, elem) {
            $rootElement.addClass('has-navbar-' + side);
            scope.$on('$destroy', function(){
              $rootElement.removeClass('has-navbar-' + side);
            });
            }
          };
        }
    ]);
  });

})();