angular.module('mobile-angular-ui.directives.sidebars', [])

.directive('sidebar', ['$document', '$rootScope', function($document, $rootScope) {
  return {
    replace: false,
    restrict: "C",
    link: function(scope, elem, attrs) {
      var shouldCloseOnOuterClicks = true;
      
      if( attrs.closeOnOuterClicks == 'false' || attrs.closeOnOuterClicks == '0') {
        shouldCloseOnOuterClicks = false;
      }

      if (elem.hasClass('sidebar-left')) {
        elem.parent().addClass('has-sidebar-left');
      }

      if (elem.hasClass('sidebar-right')) {
        elem.parent().addClass('has-sidebar-right');
      }

      var isAncestorOrSelf = function(element, target) {
        var parent = element;

        while (parent.length > 0) {
            if (parent[0] === target[0]) {
                parent = null;     
                return true;
            }
            parent = parent.parent();
        }

        parent = null;
        return false;
      };

      var closeOnOuterClicks = function(e) {
        if(! isAncestorOrSelf(angular.element(e.target), elem)) {
            $rootScope.toggle(attrs.id, 'off');
            e.preventDefault()
            return false;
        }
      }
      
      var clearCb1 = angular.noop();
      
      if (shouldCloseOnOuterClicks) {
        clearCb1 = $rootScope.$on('mobile-angular-ui.toggle.toggled', function(e, id, active){
          if(id == attrs.id) {
            if(active) {
              setTimeout(function(){
                $document.on('click tap', closeOnOuterClicks);
              }, 300);
            } else {
              $document.unbind('click tap', closeOnOuterClicks);
            }
          }
        });
      }

      scope.$on('$destroy', function(){
        clearCb1();
        $document.unbind('click tap', closeOnOuterClicks);
      });

    }
  };
}]);
