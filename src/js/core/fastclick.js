(function () {
  'use strict';
  var module = angular.module('mobile-angular-ui.core.fastclick', []);

  module.run(['$window', function($window) {
	FastClick.attach($window.document.body);  
  }]);

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