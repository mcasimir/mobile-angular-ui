angular.module('mobile-angular-ui.modals', [])

.directive('modalOverlay', [
  '$rootElement',
  function($rootElement) {
    return {
      restrict: 'C',
      link: function(scope, elem) {
        $rootElement.addClass('has-modal-overlay');
        scope.$on('$destroy', function(){
          $rootElement.removeClass('has-modal-overlay');
        });
      }
    };
}]);