 // Provides a scrollable implementation based on Overthrow
 // Many thanks to pavei (https://github.com/pavei) to submit
 // basic implementation

var module = angular.module('mobileAngularUi.scrollable', []);

module.directive('scrollableBody', function() {
  return {
    restrict: 'C',
    link: function(scope, element, attr) {
      if (overthrow.support !== 'native') {
        element.addClass('overthrow');
        overthrow.forget();
        overthrow.set();
      }
    }
  };
});

angular.forEach({Top: 'scrollableHeader', Bottom: 'scrollableFooter'}, 
  function(directiveName, side) {
      module.directive(directiveName, [
        '$window',
        function($window) {
                return {
                  restrict: 'C',
                  link: function(scope, element, attr) {
                    var el = element[0],
                        styles = $window.getComputedStyle(el),
                        margin = parseInt(styles.marginTop) + parseInt(styles.marginBottom),
                        heightWithMargin = el.offsetHeight + margin,
                        parentStyle = element.parent()[0].style;

                    parentStyle['padding' + side] = heightWithMargin + 'px'; 

                    scope.$on('$destroy', function(){
                      parentStyle['padding' + side] = '0px';
                    });
                  }
                };
              }
      ]);
  });