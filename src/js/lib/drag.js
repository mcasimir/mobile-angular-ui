angular.module("mobileAngularUi.drag", [
  'ngTouch',
  'mobileAngularUi.transform'
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
    return {
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
          scope = elem.scope(),
          
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
            start: function(c) {
              
              if (!moving) { // Sometimes $swipe calls start multiple times
                                // without before end or cancel thus we need
                                // to ensure this is a fresh start to
                                // reset everything.
                console.log('START');
                t0 = Transform.fromElement(e);
                x  = x0 = c.x;
                y  = y0 = c.y; 
                moving = true;
                if (options.start) {
                  options.start(e.getBoundingClientRect(), cancelFn, resetFn);  
                }
              }
                          
            },

            move: function(c) {
              console.log('MOVE');
              // total movement shoud match constraints
              var dx, dy,
              deltaX, deltaY, r;

              deltaX = Math.max(Math.min(maxX - deltaXTot, c.x - x0), minX - deltaXTot);
              deltaY = Math.max(Math.min(maxY - deltaYTot, c.y - y0), minY - deltaYTot);

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
                options.move(e.getBoundingClientRect(), cancelFn, resetFn);  
              }

            },

            end: function(c) {
              moving = false; 
              console.log('END');

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
                options.end(e.getBoundingClientRect(), undoFn, resetFn);
              }
            },

            cancel: function() {
              if (moving) {
                console.log('CANCEL');
                t0.set(e);  
                if (options.cancel) {
                  options.cancel(e.getBoundingClientRect(), resetFn);
                }
                moving = false;
              }
            }
          };

        scope.$on('$destroy', function() { 
          $document.unbind('mouseout', cancelFn);
          callbacks = options = e = moving = deltaXTot = deltaYTot = x0 = y0 = t0 = tOrig = x = y = t = minX = maxX = minY = maxY = scope = null;
        });

        $swipe.bind(elem, callbacks);
        $document.on('mouseout', cancelFn);
      }
    };
  }];
});