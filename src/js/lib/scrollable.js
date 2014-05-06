 // Provides a scrollable implementation based on Overthrow
 // Many thanks to pavei (https://github.com/pavei) to submit
 // basic implementation

angular.module("mobile-angular-ui.scrollable", [])

.directive("scrollableContent", [
  function() {
    return {
      replace: false,
      restrict: "C",
      link: function(scope, element, attr) {
        if (overthrow.support !== "native") {
          element.addClass("overthrow");
          overthrow.forget();
          return overthrow.set();
        }
      }
    };
  }
]);