(function () {
  'use strict';
  var module = angular.module('mobile-angular-ui.core.fastclick', []);

  module.run(function() {
    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', function() {
          FastClick.attach(document.body);
      }, false);
    }
  });

  angular.forEach(['select', 'input', 'textarea'], function(directiveName){
    module.directive(directiveName, function(){
      return {
        restrict: 'E',
        compile: function(elem) {
          elem.addClass('needsclick');
        }
      };
    });
  });
}());