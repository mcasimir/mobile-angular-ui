(function() {
  'use strict';
  var module = angular.module('mobile-angular-ui.components.scrollable', []);

  module.directive('scrollableContent', function() {
    return {
      restrict: 'C',
      controller: ['$element', function($element) {
        var scrollableContent = $element[0],
            scrollable = $element.parent()[0];

        this.scrollableContent = scrollableContent;

        // scrollTo function.
        // 
        // Usage: 
        // obtain scrollableContent controller somehow. Then:
        // 
        // - Scroll to top of containedElement
        // scrollableContentController.scrollTo(containedElement);
        // 
        // - Scroll to top of containedElement with a margin of 10px;
        // scrollableContentController.scrollTo(containedElement, 10);
        // 
        // - Scroll top by 200px;
        // scrollableContentController.scrollTo(200);
        // 
        this.scrollTo = function(elementOrNumber, marginTop) {
          marginTop = marginTop || 0;

          if (angular.isNumber(elementOrNumber)) {
            scrollableContent.scrollTop = elementOrNumber - marginTop;
          } else {
            var target = angular.element(elementOrNumber)[0];
            if ((! target.offsetParent) || target.offsetParent == scrollable) {
              scrollableContent.scrollTop = target.offsetTop - marginTop;
            } else {
              // recursively subtract offsetTop from marginTop until it reaches scrollable element.
              this.scrollTo(target.offsetParent, marginTop - target.offsetTop);
            }
          }
        };
      }],
      link: function(scope, element, attr) {
        if (overthrow.support !== 'native') {
          element.addClass('overthrow');
          overthrow.forget();
          overthrow.set();
        }
      }
    };
  });

  angular.forEach(['input', 'textarea'], function(directiveName) {
    module.directive(directiveName, ['$rootScope','$timeout', function($rootScope, $timeout) {
      return {
        require: '?^^scrollableContent',
        link: function(scope, elem, attrs, scrollable) {
          // Workaround to avoid soft keyboard hiding inputs
          elem.on('focus', function(){
            if (scrollable && scrollable.scrollableContent) {
              var h1 = scrollable.scrollableContent.offsetHeight;
              $timeout(function() {
                var h2 = scrollable.scrollableContent.offsetHeight;
                // 
                // if scrollableContent height is reduced in half second
                // since an input got focus we assume soft keyboard is showing.
                //
                if (h1 > h2) {
                  scrollable.scrollTo(elem, 10);  
                }
              }, 500);              
            }
          });
        }
      };
    }]);
  });

  // uiScrollTop/uiScrollBottom
  // 
  // usage:
  // <div class="scrollable">
  //    <div class="scrollable-content" ui-scroll-bottom='loadMore()'>
  //    </div>
  // </div>
  angular.forEach(
    {
      uiScrollTop: function(elem){
        return elem.scrollTop === 0;
      }, 
      uiScrollBottom: function(elem){
        return elem.scrollHeight == elem.scrollTop + elem.clientHeight;
      }
    }, 
    function(reached, directiveName){
      module.directive(directiveName, [function() {
        return {
          restrict: 'A',
          link: function(scope, elem, attrs) {
            elem.on('scroll', function(){
              /* If reached bottom */
              if ( reached(elem[0]) ) {
                /* Do what is specified by onScrollBottom */
                scope.$apply(function(){
                  scope.$eval(attrs[directiveName]);
                });
              }
            });
          }
        };
      }]);
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
                          parentStyle = element.parent()[0].style;

                      var adjustParentPadding = function() {
                        var styles = $window.getComputedStyle(el),
                            margin = parseInt(styles.marginTop) + parseInt(styles.marginBottom);
                        parentStyle['padding' + side] = el.offsetHeight + margin + 'px';
                      };

                      var interval = setInterval(adjustParentPadding, 30);

                      element.on('$destroy', function(){
                        parentStyle['padding' + side] = null;
                        clearInterval(interval);
                        interval = adjustParentPadding = element = null;
                      });
                    }
                  };
                }
        ]);
    });
}());