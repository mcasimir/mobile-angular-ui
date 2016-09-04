/**
 * @module mobile-angular-ui.core.activeLinks
 * @description
 *
 * `mobile-angular-ui.activeLinks` module sets up `.active` class for `a`
 * elements those `href` attribute matches the current angular `$location` url.
 * It takes care of excluding both search part and hash part from comparison.
 *
 * `.active` classes are added/removed each time one of `$locationChangeSuccess`
 * or `$includeContentLoaded` is fired.
 *
 * ## Usage
 *
 * Just declare it as a dependency to your app unless you have already included
 * one of its super-modules.
 *
 * ```
 * angular.module('myApp', ['mobile-angular-ui.core.activeLinks']);
 * ```
 *
 * **NOTE:** if you are using it without Bootstrap you may need to add some css
 * to your stylesheets to reflect the activation state of links. I.e.
 *
 * ``` css
 * a.active {
 *   color: blue;
 * }
 * ```
 */
(function() {
  'use strict';

  angular.module('mobile-angular-ui.core.activeLinks', [])
    .provider('setupActiveLinks', ['$locationProvider', function($locationProvider) {
      this.$get = [
        '$document',
        '$location',
        function($document, $location) {
          return function() {
            var currentPath = $location.path();
            var links = $document[0].links;

            for (var i = 0; i < links.length; i++) {
              var link = angular.element(links[i]);
              var href = link.attr('href');

              if (!href) {
                return link.removeClass('active');
              }

              var html5Mode = $locationProvider.html5Mode().enabled;
              if (!html5Mode) {
                var linkPrefix = '#' + $locationProvider.hashPrefix();
                if (href.slice(0, linkPrefix.length) === linkPrefix) {
                  href = href.slice(linkPrefix.length);
                } else {
                  return link.removeClass('active');
                }
              }

              if (href.charAt(0) !== '/') {
                return link.removeClass('active');
              }

              href = href.split('#')[0].split('?')[0];

              if (href === currentPath) {
                link.addClass('active');
              } else {
                link.removeClass('active');
              }
            }
          };
        }];
    }])
    .run(['$rootScope', 'setupActiveLinks', function($rootScope, setupActiveLinks) {
      $rootScope.$on('$locationChangeSuccess', setupActiveLinks);
      $rootScope.$on('$includeContentLoaded', setupActiveLinks);
    }]);
})();
