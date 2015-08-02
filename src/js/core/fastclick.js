(function () {
  'use strict';
  var module = angular.module('mobile-angular-ui.core.fastclick', []);

  module.run(['$window', function($window) {

	//Temporarly bugfix in overthrow/fastclick:
	var orgHandler = FastClick.prototype.onTouchEnd;

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function() { return method.apply(context, arguments); };
	}

	FastClick.prototype.onTouchEnd = function(event) {

		if (!event.changedTouches) {
      event.changedTouches = [{}];
    }
    
		orgHandler = bind(orgHandler, this);
		orgHandler(event);
	};

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
