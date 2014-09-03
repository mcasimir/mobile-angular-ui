// Provides touch events via fastclick.js
var module = angular.module('mobileAngularUi.fastclick', []);

module.run(function($window, $document) {
    $window.addEventListener("load", (function() {
       FastClick.attach($document[0].body);
    }), false);
});

angular.forEach(['select', 'input', 'textarea'], function(directiveName){
  module.directive(directiveName, function(){
    return {
      restrict: "E",
      compile: function(elem) {
        elem.addClass("needsclick");
      }
    };
  });
});