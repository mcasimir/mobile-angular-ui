/**
@module mobile-angular-ui.core.activeLinks
@description

`mobile-angular-ui.activeLinks` module sets up `.active` class for `a` elements those `href` attribute matches the current angular `$location` url. It takes care of excluding both search part and hash part from comparison.

`.active` classes are added/removed each time one of `$locationChangeSuccess` or `$includeContentLoaded` is fired.

## Usage

Just declare it as a dependency to your app unless you have already included one of its super-modules.

```
angular.module('myApp', ['mobile-angular-ui.core.activeLinks']);
```

**NOTE:** if you are using it without Bootstrap you may need to add some css to your stylesheets to reflect the activation state of links. I.e.

``` css
a.active {
  color: blue;
}
```

*/
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
          } else if (firstHash !== -1 && firstHash > firstSearchMark) {
            newPath = locationHref.slice(0, plainUrlLength + firstHash);
          } else if (firstSearchMark !== -1 && firstSearchMark > firstHash) {
            newPath = locationHref.slice(0, plainUrlLength + firstSearchMark);
          }
          
          var domLinks = $document[0].links;
          for (var i = 0; i < domLinks.length; i++) {
            var domLink = domLinks[i];
            var link    = angular.element(domLink);
            if (link.attr('href') && link.attr('href') !== '' && domLink.href === newPath) {
              link.addClass('active');
            } else if (link.attr('href') && link.attr('href') !== '' && domLink.href && domLink.href.length) {
              link.removeClass('active');
            }
          }
        };

        $rootScope.$on('$locationChangeSuccess', setupActiveLinks);
        $rootScope.$on('$includeContentLoaded', setupActiveLinks);
      }
  ]);

}());

