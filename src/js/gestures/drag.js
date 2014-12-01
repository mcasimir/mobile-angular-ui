(function () {
   'use strict';

   angular.module('mobile-angular-ui.gestures.drag', [
     'mobile-angular-ui.gestures.swipe',
     'mobile-angular-ui.gestures.transform'
   ])

   // 
   // $drag
   // 
   // A provider to create touch & drag components.
   // 
   // $drag Service wraps ngTouch $swipe to extend its behavior moving one or more
   // target element throug css transform according to the $swipe coords thus creating 
   // a drag effect.
   // 
   // $drag interface is similar to $swipe:
   // 
   // app.controller('MyController', function($drag, $element){
   //   $drag.bind($element, {
   //    start: function(coords, cancel, markers, e){},
   //    move: function(coords, cancel, markers, e){},
   //    end: function(coords, cancel, markers, e){},
   //    cancel: function(coords, markers, e){},
   //    transform: function(x, y, transform) {},
   //    adaptTransform: function(x, y, transform) {},
   //    constraint: fn or {top: y1, left: x1, bottom: y2, right: x2}
   //   });
   // });
   // 
   // Main differences from $swipe are: 
   //  - coords param take into account css transform so you can easily detect collision with other elements.
   //  - start, move, end callback receive a cancel funcion that can be used to cancel the motion and reset
   //    the transform.
   //  - you can configure the transform behavior passing a transform function to options.
   //  - you can constraint the motion through the constraint option (setting relative movement limits) 
   //    or through the track option (setting absolute coords);
   //  - you can setup collision markers being watched and passed to callbacks.
   //  
   // Example (drag to dismiss):
   //  $drag.bind(e, {
   //    move: function(c, cancel, markers){
   //      if(c.left > markers.m1.left) {
   //        e.addClass('willBeDeleted');
   //      } else {
   //        e.removeClass('willBeDeleted');
   //      }
   //    },
   //    end: function(coords, cancel){
   //      if(c.left > markers.m1.left) {
   //        e.addClass('deleting');
   //        delete($scope.myModel).then(function(){
   //          e.remove();
   //        }, function(){
   //          cancel();
   //        });
   //      } else {
   //        cancel();
   //      }
   //    },
   //    cancel: function(){
   //      e.removeClass('willBeDeleted');
   //      e.removeClass('deleting');
   //    },
   //    constraint: { 
   //        minX: 0, 
   //        minY: 0, 
   //        maxY: 0 
   //     },
   //   });

  .provider('$drag', function() {
    this.$get = ['$swipe', '$document', 'Transform', function($swipe, $document, Transform) {

      var style = document.createElement('style');
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
      var sheet = style.sheet;
      // Makes z-index 99999
      sheet.insertRule('html .ui-drag-move{z-index: 99999 !important;}');
      // Disable transitions
      sheet.insertRule('html .ui-drag-move{-webkit-transition: none !important;-moz-transition: none !important;-o-transition: none !important;-ms-transition: none !important;transition: none !important;}');
      // Makes text unselectable
      sheet.insertRule('html .ui-drag-move, html .ui-drag-move *{-webkit-touch-callout: none !important;-webkit-user-select: none !important;-khtml-user-select: none !important;-moz-user-select: none !important;-ms-user-select: none !important;user-select: none !important;}');

      return {
        Transform: Transform,
        bind: function(elem, options) {
          var defaults = {
            constraint: {}
          };

          options = angular.extend({}, defaults, options || {});

          var
            e = angular.element(elem)[0],
            moving = false,
            deltaXTot = 0, // total movement since elem is bound
            deltaYTot = 0,
            x0, y0, // touch coords on start 
            t0, // transform on start
            tOrig = Transform.fromElement(e),
            x, y, // current touch coords
            t, // current transform
            minX = options.constraint.minX !== undefined ? options.constraint.minX : Number.NEGATIVE_INFINITY,
            maxX = options.constraint.maxX !== undefined ? options.constraint.maxX : Number.POSITIVE_INFINITY,
            minY = options.constraint.minY !== undefined ? options.constraint.minY : Number.NEGATIVE_INFINITY,
            maxY = options.constraint.maxY !== undefined ? options.constraint.maxY : Number.POSITIVE_INFINITY,
            
            preventedWhileMoving = ['click', 'tap', 'mouseup', 'touchend'],

            captureClicks = function(e) {
              e.stopPropagation();
            },

            cancelFn = function(){
              elem.triggerHandler('touchcancel');
            },

            resetFn = function(){
              elem.triggerHandler('touchcancel');
              deltaXTot = 0;
              deltaYTot = 0;
              tOrig.set(e);
            },

            callbacks = {
              move: function(c) {
                if (elem[0].addEventListener) {
                  for (var i = 0; i < preventedWhileMoving.length; i++) {
                    
                    // Sorry.. for IE8 we are not capturing clicks
                    // for inner elements, hope it wont cause too 
                    // much problems
                    elem[0].addEventListener(preventedWhileMoving[i], captureClicks, true);
                  }                  
                }

                if (!moving) {    // $swipe calls start at the first touch
                                  // to ensure $drag start is called only while actually
                                  // dragging and not for touches we will bind $drag.start
                                  // to the first time move is called.

                  t0 = Transform.fromElement(e);
                  x  = x0 = c.x;
                  y  = y0 = c.y; 

                  elem.addClass('ui-drag-move');

                  if (options.start) {
                    options.start(e.getBoundingClientRect(), cancelFn, resetFn, c);    
                  }

                  moving = true;
                }

                // total movement shoud match constraints
                var dx, dy,
                deltaX, deltaY, r,
                rectBefore = e.getBoundingClientRect(),
                _maxX = angular.isFunction(maxX) ? maxX() : maxX,
                _maxY = angular.isFunction(maxY) ? maxY() : maxY,
                _minX = angular.isFunction(minX) ? minX() : minX,
                _minY = angular.isFunction(minY) ? minY() : minY;

                deltaX = Math.max(Math.min(_maxX - deltaXTot, c.x - x0), _minX - deltaXTot);
                deltaY = Math.max(Math.min(_maxY - deltaYTot, c.y - y0), _minY - deltaYTot);

                dx = deltaX - (x - x0);
                dy = deltaY - (y - y0);

                t = Transform.fromElement(e); 

                if (options.transform) {
                  r = options.transform(t, dx, dy, c.x, c.y, x0, y0);
                  t = r || t;
                } else {
                  t.translate(dx, dy);
                }

                if (options.adaptTransform) {
                  r = options.adaptTransform(t, dx, dy, c.x, c.y, x0, y0);
                  t = r || t;
                }
                
                x = deltaX + x0;
                y = deltaY + y0;

                t.set(e);

                if (options.move) {
                  options.move(e.getBoundingClientRect(), cancelFn, resetFn, c);  
                }

              },

              end: function(c) {
                moving = false;
                if (elem[0].removeEventListener) {
                  for (var i = 0; i < preventedWhileMoving.length; i++) {
                    elem[0].removeEventListener(preventedWhileMoving[i], captureClicks);
                  }                  
                }

                var deltaXTotOld = deltaXTot;
                var deltaYTotOld = deltaYTot;

                var undoFn = function() {
                  deltaXTot = deltaXTotOld;
                  deltaYTot = deltaYTotOld;
                  t0.set(e);
                };

                deltaXTot = deltaXTot + x - x0;
                deltaYTot = deltaYTot + y - y0;
                
                if (options.end) {
                  options.end(e.getBoundingClientRect(), undoFn, resetFn, c);
                }
                
                elem.removeClass('ui-drag-move');
              },

              cancel: function() {
                if (elem[0].removeEventListener) {
                  for (var i = 0; i < preventedWhileMoving.length; i++) {
                    elem[0].removeEventListener(preventedWhileMoving[i], captureClicks);
                  }                  
                }

                if (moving) {
                  t0.set(e);  
                  if (options.cancel) {
                    options.cancel(e.getBoundingClientRect(), resetFn);
                  }
                  moving = false;
                  elem.removeClass('ui-drag-move');
                }
              }
            };

          elem.on('$destroy', function() { 
            $document.unbind('mouseout', cancelFn);
            callbacks = options = e = moving = deltaXTot = deltaYTot = x0 = y0 = t0 = tOrig = x = y = t = minX = maxX = minY = maxY = null;
          });

          var unbind = $swipe.bind(elem, callbacks);
          $document.on('mouseout', cancelFn);
          return unbind;
        }
      };
    }];
  });

}());


