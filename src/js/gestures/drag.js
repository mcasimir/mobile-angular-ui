(function () {
   'use strict';

   angular.module('mobile-angular-ui.gestures.drag', [
     'mobile-angular-ui.gestures.touch',
     'mobile-angular-ui.gestures.transform'
   ])

  // `$drag` Service wraps `$touch` to extend its behavior moving target element through css transform according to the `$touch` coords thus creating 
  // a drag effect.

  // $drag interface is very close to `$touch`:

  // app.controller('MyController', function($drag, $element){
  //   var unbindDrag = $drag.bind($element, {
  //    // drag callbacks
  //    // - rect is the current result of getBoundingClientRect() for bound element
  //    // - resetFn restore the initial transform
  //    // - undoFn undoes the current movement
  //    // - swipeCoords are the coordinates exposed by the underlying $touch service
  //    start: function(dragInfo, reset, event) {},
  //    move: function(dragInfo, undo, reset, event) {},
  //    end: function(dragInfo, undo, reset, event) {},
  //    cancel: function(dragInfo) {};

  //    // constraints for the movement
  //    // you can use a "static" object of the form:
  //    // {top: .., lelf: .., bottom: .., rigth: ..}
  //    // or pass a function that is called on each movement 
  //    // and return it in a dynamic way.
  //    // This is useful if you have to constraint drag movement while bounduaries are
  //    // changing over time.

  //    constraint: function(){ return {top: y1, left: x1, bottom: y2, right: x2}; }, // or just {top: y1, left: x1, bottom: y2, right: x2}

  //    // instantiates the Trasform according to touch movement (defaults to `t.translate(dx, dy);`)
  //    // dx, dy are the distances of movement for x and y axis after constraints are applyied
  //    transform: function(transform, dx, dy, currSwipeX, currSwipeY, startSwipeX, startSwipeY) {},
    
  //   // This is automatically called when element is disposed so it is not necessary
  //   // that you call this manually but if you have to detatch $drag service before
  //   // this you could just call:
  //   unbindDrag();
  // });

  // Main differences with `$touch` are:
  //  - bound elements will move following swipe direction automatically
  //  - coords param take into account css transform so you can easily detect collision with other elements.
  //  - start, move, end callback receive a cancel funcion that can be used to cancel the motion and reset
  //    the transform.
  //  - you can configure the transform behavior passing a transform function to options.
  //  - you can constraint the motion through the constraint option (setting relative movement limits)
   
  // Example (drag to dismiss):

  // app.directive('dragToDismiss', function($drag, $parse, $timeout){
  //   return {
  //     restrict: 'A',
  //     compile: function($element, attrs) {
  //       var dismissFn = $parse(attrs.dragToDismiss);
  //       return function(scope, $element, attrs){
  //         var dismiss = false;

  //         $drag.bind($element, {
  //           constraint: {
  //             minX: 0, 
  //             minY: 0, 
  //             maxY: 0 
  //           },
  //           move: function(c) {
  //             if( c.left >= c.width / 4) {
  //               dismiss = true;
  //               $element.addClass('dismiss');
  //             } else {
  //               dismiss = false;
  //               $element.removeClass('dismiss');
  //             }
  //           },
  //           cancel: function(){
  //             $element.removeClass('dismiss');
  //           },
  //           end: function(c, undo, reset) {
  //             if (dismiss) {
  //               $element.addClass('dismitted');
  //               $timeout(function() { 
  //                 scope.$apply(function() {
  //                   dismissFn(scope);  
  //                 });
  //               }, 400);
  //             } else {
  //               reset();
  //             }
  //           }
  //         });
  //       };
  //     }
  //   };
  // });

  .provider('$drag', function() {
    this.$get = ['$touch', '$document', '$transform', function($touch, $document, $transform) {

      // Add some css rules to be used while moving elements
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
      var sheet = style.sheet;

      // Makes z-index 99999
      sheet.insertRule('html .ui-drag-move{z-index: 99999 !important;}', 0);
      // Disable transitions
      sheet.insertRule('html .ui-drag-move{-webkit-transition: none !important;-moz-transition: none !important;-o-transition: none !important;-ms-transition: none !important;transition: none !important;}', 0);
      // Makes text unselectable
      sheet.insertRule('html .ui-drag-move, html .ui-drag-move *{-webkit-touch-callout: none !important;-webkit-user-select: none !important;-khtml-user-select: none !important;-moz-user-select: none !important;-ms-user-select: none !important;user-select: none !important;}', 0);

      style = sheet = null;   // we wont use them anymore so make 
                             // their memory immediately claimable

      return {

        // 
        // built-in transforms
        // 
        NULL_TRANSFORM: function(element, transform) {
          return transform;
        },

        TRANSLATE_BOTH: function(element, transform, touch) {
          transform.translateX = touch.distanceX;
          transform.translateY = touch.distanceY;
          return transform;
        },

        TRANSLATE_HORIZONTAL: function(element, transform, touch) {
          transform.translateX = touch.distanceX;
          transform.translateY = 0;
          return transform;
        },

        TRANSLATE_UP: function(element, transform, touch) {
          transform.translateY = touch.distanceY <= 0 ? touch.distanceY : 0;
          transform.translateX = 0;
          return transform;
        },

        TRANSLATE_DOWN: function(element, transform, touch) {
          transform.translateY = touch.distanceY >= 0 ? touch.distanceY : 0;
          transform.translateX = 0;
          return transform;
        },

        TRANSLATE_LEFT: function(element, transform, touch) {
          transform.translateX = touch.distanceX <= 0 ? touch.distanceX : 0;
          transform.translateY = 0;
          return transform;
        },

        TRANSLATE_RIGHT: function(element, transform, touch) {
          transform.translateX = touch.distanceX >= 0 ? touch.distanceX : 0;
          transform.translateY = 0;
          return transform;
        },

        TRANSLATE_VERTICAL: function(element, transform, touch) {
          transform.translateX = 0;
          transform.translateY = touch.distanceY;
          return transform;
        },

        TRANSLATE_INSIDE: function(wrapperElementOrRectangle) {
          wrapperElementOrRectangle = wrapperElementOrRectangle.length ? wrapperElementOrRectangle[0] : wrapperElementOrRectangle;
          
          return function(element, transform, touch) {
            element = element.length ? element[0] : element;
            var re = element.getBoundingClientRect();
            var rw = wrapperElementOrRectangle instanceof HTMLElement ? wrapperElementOrRectangle.getBoundingClientRect() : wrapperElementOrRectangle;
            var tx, ty;

            if (re.width >= rw.width) {
              tx = 0;   
            } else {
              // compute translateX so that re.left and re.right will stay between rw.left and rw.right
              if (re.right + touch.stepX > rw.right) {
                tx = rw.right - re.right;
              } else if (re.left + touch.stepX < rw.left) {
                tx = rw.left - re.left;
              } else {
                tx = touch.stepX;
              }

            }

            if (re.height >= rw.height) {
              ty = 0;   
            } else {
              if (re.bottom + touch.stepY > rw.bottom) {
                ty = rw.bottom - re.bottom;
              } else if (re.top + touch.stepY < rw.top) {
                ty = rw.top - re.top;
              } else {
                ty = touch.stepY;
              }
            }

            transform.translateX += tx;
            transform.translateY += ty;
            return transform;
          };
        },

        // 
        // bind function
        // 
        bind: function($element, dragOptions, touchOptions) {
          $element = angular.element($element);
          dragOptions = dragOptions || {};
          touchOptions = touchOptions || {};
          
          var startEventHandler = dragOptions.start,
              endEventHandler = dragOptions.end,
              moveEventHandler = dragOptions.move,
              cancelEventHandler = dragOptions.cancel,
              transformEventHandler = dragOptions.transform || this.TRANSLATE_BOTH;

          var domElement = $element[0],
              tO = $transform.get($element), // original transform
              rO = domElement.getBoundingClientRect(), // original bounding rect
              tS, // transform at start
              rS;

            var moving = false;
            
            var isMoving = function() {
              return moving;
            };
            
            var cleanup = function() {
              moving = false;
              tS = rS = null;
              $element.removeClass('ui-drag-move');
            };
            
            var reset = function() {
              $transform.set(domElement, tO);
            };

            var undo = function() {
              $transform.set(domElement, tS || tO);
            };

            var setup = function() {
              moving = true;
              rS = domElement.getBoundingClientRect();
              tS = $transform.get(domElement);
              $element.addClass('ui-drag-move');
            };

            var createDragInfo = function(touch) {
              touch = angular.extend({}, touch);
              touch.originalTransform = tO;
              touch.originalRect = rO;
              touch.startRect = rS;
              touch.rect = domElement.getBoundingClientRect();
              touch.startTransform = tS;
              touch.transform = $transform.get(domElement);
              touch.reset = reset;
              touch.undo = undo;
              return touch;
            };

            var onTouchMove = function(touch, event) {
              // preventDefault no matter what 
              // it is (ie. maybe html5 drag for images or scroll)
              event.preventDefault();

              // $touch calls start on the first touch
              // to ensure $drag.start is called only while actually
              // dragging and not for touches we will bind $drag.start
              // to the first time move is called
              
              if (!isMoving()) { // drag start
                setup();
                if (startEventHandler) {
                  startEventHandler(createDragInfo(touch), event);
                }
              } else { // drag move
                touch = createDragInfo(touch);

                var transform = transformEventHandler($element, angular.extend({}, touch.transform), touch, event);

                $transform.set(domElement, transform);

                if (moveEventHandler) {
                  moveEventHandler(touch, event);
                }
              }
            };

            var onTouchEnd = function(touch, event) {
              if (!isMoving()) { return; }
              
              touch = createDragInfo(touch);
              cleanup();
              
              if (endEventHandler) {
                endEventHandler(touch, event);
              }
            };

            var onTouchCancel = function(touch, event) {
              if (!isMoving()) { return; }
              
              touch = createDragInfo(touch);
              undo(); // on cancel movement is undoed automatically;
              cleanup();

              if (cancelEventHandler) {
                cancelEventHandler(touch, event);
              }
            };

            return $touch.bind($element, {move: onTouchMove, end: onTouchEnd, cancel: onTouchCancel});
          } // ~ bind
        }; // ~ return $drag
      }]; // ~ $get
  });

}());