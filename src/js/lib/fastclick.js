// Provides touch events via fastclick.js
angular.module('mobile-angular-ui.fastclick', [])

.run([
  '$window', '$document', function($window, $document) {
    $window.addEventListener("load", (function() {
       FastClick.attach($document[0].body);
    }), false);
  }
])

.directive("select", function() {
  return {
    replace: false,
    restrict: "E",
    link: function(scope, element, attr) {
      element.addClass("needsclick");
    }
  };
})

.directive("input", function() {
  return {
    replace: false,
    restrict: "E",
    link: function(scope, element, attr) {
      element.addClass("needsclick");
    }
  };
})

.directive("textarea", function() {
  return {
    replace: false,
    restrict: "E",
    link: function(scope, element, attr) {
      element.addClass("needsclick");
    }
  };
})
