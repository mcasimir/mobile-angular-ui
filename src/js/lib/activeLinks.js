angular.module("mobileAngularUi.activeLinks", [])

.run([
    '$rootScope', 
    '$window', 
    '$document',
    function($rootScope, $window, $document){

      var setupActiveLinks = function() {
        var newPath  = $window.location.href;
        var domLinks = $document[0].links;

        for (var i = 0; i < domLinks.length; i++) {
          var domLink = domLinks[i];
          var link    = angular.element(domLink);

          if (domLink.href === newPath) {
            link.addClass('active');
          } else {
            link.removeClass('active');
          }

        }
      };

      $rootScope.$on('$locationChangeSuccess', setupActiveLinks);
      $rootScope.$on('$includeContentLoaded', setupActiveLinks);
    }
]);