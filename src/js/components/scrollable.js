/**
 * @module mobile-angular-ui.components.scrollable
 * @description
 *
 * One thing you'll always have to deal with approaching mobile web app
 * development is scroll and `position:fixed` bugs.
 *
 * Due to the lack of support in some devices fixed positioned elements may
 * bounce or disappear during scroll. Also mobile interaction often leverages
 * horizontal scroll eg. in carousels or sliders.
 *
 * We use `overflow:auto` to create scrollable areas and solve any problems
 * related to scroll.
 *
 * Since `overflow:auto` is not always available in touch devices we use [Overthrow](http://filamentgroup.github.io/Overthrow/) to polyfill that.
 *
 * Markup for any scrollable areas is as simple as:
 *
 * ``` html
 * <div class="scrollable">
 *   <div class="scrollable-content">...</div>
 * </div>
 * ```
 *
 * This piece of code will trigger a directive that properly setup a new `Overthrow`
 * instance for the `.scrollable` node.
 *
 * #### Headers and footers
 *
 * `.scrollable-header/.scrollable-footer` can be used to add fixed header/footer
 * to a scrollable area without having to deal with css height and positioning to
 * avoid breaking scroll.
 *
 * ``` html
 * <div class="scrollable">
 *   <div class="scrollable-header"><!-- ... --></div>
 *   <div class="scrollable-content"><!-- ... --></div>
 *   <div class="scrollable-footer"><!-- ... --></div>
 * </div>
 * ```
 *
 * #### scrollTo
 *
 * `.scrollable-content` controller exposes a `scrollTo` function: `scrollTo(offsetOrElement, margin)`
 *
 * You have to require it in your directives to use it or obtain through `element().controller`:
 *
 * ``` js
 * var elem = element(document.getElementById('myScrollableContent'));
 * var scrollableContentController = elem.controller('scrollableContent');
 *
 * // - Scroll to top of containedElement
 * scrollableContentController.scrollTo(containedElement);
 *
 * // - Scroll to top of containedElement with a margin of 10px;
 * scrollableContentController.scrollTo(containedElement, 10);
 *
 * // - Scroll top by 200px;
 * scrollableContentController.scrollTo(200);
 * ```
 *
 * #### `ui-scroll-bottom/ui-scroll-top`
 *
 * You can use `ui-scroll-bottom/ui-scroll-top` directives handle that events and implement features like _infinite scroll_.
 *
 * ``` html
 * <div class="scrollable">
 *   <div class="scrollable-content section" ui-scroll-bottom="loadMore()">
 *     <ul>
 *       <li ng-repeat="item in items">
 *         {{item.name}}
 *       </li>
 *     </ul>
 *   </div>
 * </div>
 * ```
 */
(function() {
  'use strict';
  var module = angular.module('mobile-angular-ui.components.scrollable',
    ['mobile-angular-ui.core.touchmoveDefaults']);

  var getTouchY = function(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) ||
        (event.originalEvent && event.originalEvent.changedTouches &&
            event.originalEvent.changedTouches[0]) ||
        touches[0].originalEvent || touches[0];

    return e.clientY;
  };

  module.directive('scrollableContent', function() {
    return {
      restrict: 'C',
      controller: ['$element', '$document', 'allowTouchmoveDefault', function($element, $document, allowTouchmoveDefault) {
        var scrollableContent = $element[0];
        var scrollable = $element.parent()[0];

        // Handle nobounce behaviour
        if ('ontouchmove' in $document[0]) {
          var allowUp;
          var allowDown;
          var lastY;
          var setupTouchstart = function(event) {
            allowUp = (scrollableContent.scrollTop > 0);

            allowDown = (scrollableContent.scrollTop < scrollableContent.scrollHeight - scrollableContent.clientHeight);
            lastY = getTouchY(event);
          };

          $element.on('touchstart', setupTouchstart);
          $element.on('$destroy', function() {
            $element.off('touchstart');
          });

          allowTouchmoveDefault($element, function(event) {
            var currY = getTouchY(event);
            var up = (currY > lastY);
            var down = !up;
            lastY = currY;
            return (up && allowUp) || (down && allowDown);
          });
        }

        this.scrollableContent = scrollableContent;

        this.scrollTo = function(elementOrNumber, marginTop) {
          marginTop = marginTop || 0;

          if (angular.isNumber(elementOrNumber)) {
            scrollableContent.scrollTop = elementOrNumber - marginTop;
          } else {
            var target = angular.element(elementOrNumber)[0];
            if ((!target.offsetParent) || target.offsetParent === scrollable) {
              scrollableContent.scrollTop = target.offsetTop - marginTop;
            } else {
              // recursively subtract offsetTop from marginTop until it reaches scrollable element.
              this.scrollTo(target.offsetParent, marginTop - target.offsetTop);
            }
          }
        };
      }],
      link: function(scope, element) {
        if (overthrow.support !== 'native') {
          element.addClass('overthrow');
          overthrow.forget();
          overthrow.set();
        }
      }
    };
  });

  angular.forEach(['input', 'textarea'], function(directiveName) {
    module.directive(directiveName, ['$rootScope', '$timeout', function($rootScope, $timeout) {
      return {
        require: '?^^scrollableContent',
        link: function(scope, elem, attrs, scrollable) {
          // Workaround to avoid soft keyboard hiding inputs
          elem.on('focus', function() {
            if (scrollable && scrollable.scrollableContent) {
              var h1 = scrollable.scrollableContent.offsetHeight;
              $timeout(function() {
                var h2 = scrollable.scrollableContent.offsetHeight;
                //
                // if scrollableContent height is reduced in half second
                // since an input got focus we assume soft keyboard is showing.
                //
                if (h1 > h2) {
                  var marginTop = 10;
                  // if scrollableHeader is present increase the marginTop to compensate for scrollableHeader's height.
                  var scrollableHeader = scrollable.scrollableContent.parentElement.querySelector('.scrollable-header');
                  if (scrollableHeader) {
                    marginTop = (scrollableHeader.getBoundingClientRect().bottom - scrollableHeader.getBoundingClientRect().top) + marginTop;
                  }
                  scrollable.scrollTo(elem, marginTop);
                }
              }, 500);
            }
          });
        }
      };
    }]);
  });

  /**
   * @directive uiScrollTop
   * @restrict A
   *
   * @param {expression} uiScrollTop The expression to be evaluated when scroll
   * reaches top of element.
   */

  /**
   * @directive uiScrollBottom
   * @restrict A
   *
   * @param {expression} uiScrollBottom The expression to be evaluated when scroll
   * reaches bottom of element.
   */
  angular.forEach(
    {
      uiScrollTop: function(elem) {
        return elem.scrollTop === 0;
      },
      uiScrollBottom: function(elem) {
        return elem.scrollHeight === elem.scrollTop + elem.clientHeight;
      }
    },
    function(reached, directiveName) {
      module.directive(directiveName, [function() {
        return {
          restrict: 'A',
          link: function(scope, elem, attrs) {
            elem.on('scroll', function() {
              /* If reached bottom */
              if (reached(elem[0])) {
                /* Do what is specified by onScrollBottom */
                scope.$apply(function() {
                  scope.$eval(attrs[directiveName]);
                });
              }
            });
          }
        };
      }]);
    });

  /**
   * @directive uiScrollableHeader
   * @restrict C
   */

  /**
   * @directive uiScrollableFooter
   * @restrict C
   */
  angular.forEach({Top: 'scrollableHeader', Bottom: 'scrollableFooter'},
    function(directiveName, side) {
      module.directive(directiveName, [
        '$window',
        function($window) {
          return {
            restrict: 'C',
            link: function(scope, element) {
              var el = element[0];
              var parentStyle = element.parent()[0].style;

              var adjustParentPadding = function() {
                var styles = $window.getComputedStyle(el);
                var margin = parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
                parentStyle['padding' + side] = el.offsetHeight + margin + 'px';
              };

              var interval = setInterval(adjustParentPadding, 30);

              element.on('$destroy', function() {
                parentStyle['padding' + side] = null;
                clearInterval(interval);
                interval = adjustParentPadding = element = null;
              });
            }
          };
        }
      ]);
    });
})();
