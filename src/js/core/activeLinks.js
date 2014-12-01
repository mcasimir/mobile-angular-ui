(function () {
  'use strict';

  angular.module("mobile-angular-ui.core.activeLinks", [])

  .run([
      '$rootScope', 
      '$window', 
      '$document',
      '$location',
      function($rootScope, $window, $document, $location){

        var setupActiveLinks = function() {
          // Excludes both search part and hash part from 
          // comparison.
          var url = $location.url(),
              firstHash = url.indexOf('#'),
              firstSearchMark = url.indexOf('?'),
              locationHref = $window.location.href,
              plainUrlLength = locationHref.indexOf(url),
              newPath;

          if (firstHash === -1 && firstSearchMark === -1) {
            newPath = locationHref;
          } else if (firstHash != -1 && firstHash > firstSearchMark) {
            newPath = locationHref.slice(0, plainUrlLength + firstHash);
          } else if (firstSearchMark != -1 && firstSearchMark > firstHash) {
            newPath = locationHref.slice(0, plainUrlLength + firstSearchMark);
          }
          
          var domLinks = $document[0].links;
          for (var i = 0; i < domLinks.length; i++) {
            var domLink = domLinks[i];
            var link    = angular.element(domLink);

            if (domLink.href === newPath) {
              link.addClass('active');
            } else if (domLink.href && domLink.href.length) {
              link.removeClass('active');
            }
          }
        };

        $rootScope.$on('$locationChangeSuccess', setupActiveLinks);
        $rootScope.$on('$includeContentLoaded', setupActiveLinks);
      }
  ]);

}());

