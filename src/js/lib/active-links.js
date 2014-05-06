angular.module("mobile-angular-ui.active-links", []).run([
  "$rootScope", function($rootScope) {
    return angular.forEach(["$locationChangeSuccess", "$includeContentLoaded"], function(evtName) {
      return $rootScope.$on(evtName, function() {
        var newPath;
        newPath = window.location.href;
        angular.forEach(document.links, function(domLink) {
          var link;
          link = angular.element(domLink);
          if (domLink.href === newPath) {
            link.addClass("active");
          } else {
            link.removeClass("active");
          }
          return link = null;
        });
        return newPath = null;
      });
    });
  }
]);
