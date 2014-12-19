(function () {
  'use strict';
  angular.module('mobile-angular-ui.components.modals', [])

  .directive('modal', [
    '$rootElement',
    function($rootElement) {
      return {
        restrict: 'C',
        link: function(scope, elem) {
          $rootElement.addClass('has-modal');
          elem.on('$destroy', function(){
            $rootElement.removeClass('has-modal');
          });
          scope.$on('$destroy', function(){
            $rootElement.removeClass('has-modal');
          });
        }
      };
  }])

  .directive('modalOverlay', [
    '$rootElement',
    function($rootElement) {
      return {
        restrict: 'C',
        link: function(scope, elem) {
          $rootElement.addClass('has-modal-overlay');
          elem.on('$destroy', function(){
            $rootElement.removeClass('has-modal-overlay');
          });
          scope.$on('$destroy', function(){
            $rootElement.removeClass('has-modal-overlay');
          });
        }
      };
  }]);   
}());