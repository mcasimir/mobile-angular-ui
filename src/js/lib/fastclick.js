(function () {
   'use strict';
   var module = angular.module('mobile-angular-ui.fastclick', []);

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
}());