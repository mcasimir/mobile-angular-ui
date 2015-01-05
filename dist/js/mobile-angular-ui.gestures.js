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
    this.$get = ['$touch', '$transform', function($touch, $transform) {

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
            var rw = wrapperElementOrRectangle instanceof Element ? wrapperElementOrRectangle.getBoundingClientRect() : wrapperElementOrRectangle;
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

            return $touch.bind($element, 
              {move: onTouchMove, end: onTouchEnd, cancel: onTouchCancel},
              touchOptions);
          } // ~ bind
        }; // ~ return $drag
      }]; // ~ $get
  });

}());
(function() {
  'use strict';

  // An adaptation of ngTouch.$swipe
  // basically the same despite of:
  // 1) It is based on 'mobile-angular-ui.gestures.touch'
  // 2) It does not require ngTouch thus is better compatible with fastclick.js 
  // 3) It allows to unbind
  var module = angular.module('mobile-angular-ui.gestures.swipe', 
    ['mobile-angular-ui.gestures.touch']);

  module.factory('$swipe', ['$touch', function($touch) {
    var VELOCITY_THRESHOLD = 1000; // px/sec
    var MOVEMENT_THRESHOLD = 10; // px
    var TURNAROUND_MAX = 10; // px
    var ANGLE_THRESHOLD = 4; // deg
    var abs = Math.abs;

    var defaultOptions = {
      movementThreshold: MOVEMENT_THRESHOLD, // start to consider only if movement 
                                             // exceeded MOVEMENT_THRESHOLD
      valid: function(t) {
        var absAngle = abs(t.angle);
        absAngle = absAngle >= 90 ? absAngle - 90 : absAngle;

        var validDistance = t.total - t.distance <= TURNAROUND_MAX,
            validAngle = absAngle <= ANGLE_THRESHOLD || absAngle >= 90 - ANGLE_THRESHOLD,
            validVelocity = t.averageVelocity >= VELOCITY_THRESHOLD;
        
        return validDistance && validAngle && validVelocity;
      }
    };

    return {
      bind: function(element, eventHandlers, options) {
        options = angular.extend({}, defaultOptions, options || {});
        return $touch.bind(element, eventHandlers, options);
      }
    };
  }]);

  // Same that for ng-swipe-left/ng-swipe-right but allows for nesting
  // Only inner directive will trigger swipe handler
  var makeSwipeDirective = function(directiveName, direction, eventName) {
    module.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {

      return function(scope, element, attr) {
        var swipeHandler = $parse(attr[directiveName]);
        var pointerTypes = ['touch'];
        if (!angular.isDefined(attr.ngSwipeDisableMouse)) {
          pointerTypes.push('mouse');
        }
        var opts = {
          pointerTypes: pointerTypes
        };
        $swipe.bind(element, {
          end: function(coords, event) {
            if (!event.__UiSwipeHandled__) {
              event.__UiSwipeHandled__ = true;
                scope.$apply(function() {
                  element.triggerHandler(eventName);
                  swipeHandler(scope, {$event: event});
                });
              }
            }
          }, opts);
      };
    }]);
  };

  // Left is negative X-coordinate, right is positive.
  makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
  makeSwipeDirective('ngSwipeRight', 1, 'swiperight');
}());
(function() {
  'use strict';

  // input-device agnostic touch handling. 
  // $touch service is an abstraction of touch event handling that works with any kind of
  // input devices. It is intended for single touch only and it provides extended infos
  // about touch like: movement direction, velocity, duration ...
  // 
  // $touch service is intended as base to build any single-touch gesture handlers
  // 
  // Usage:
  // 
  // $touch.bind(element, {
  //    start: function(touchInfo, e);
  //    move: function(touchInfo, e);
  //    end: function(touchInfo, e);
  //    cancel: function(touchInfo, e);
  // }, options);
  // 
  // touchInfo is an object containing:
  // - timestamp
  // - duration
  // - startX
  // - startY
  // - prevX
  // - prevY
  // - x
  // - y
  // - step
  // - stepX
  // - stepY
  // - velocity
  // - distance: linear distance from start
  // - distanceX
  // - distanceY
  // - total: total length of the movement (considering turnarounds etc ...)
  // - totalX
  // - totalY
  // 
  // - direction: angle of movement from start in degree (or null)
  // 
  // options is an object specifing:
  // 
  // - movementThreshold: 10
  // - valid: (fn->bool or bool) wether yield to scroll or prevent it
  // - pointerTypes: (array) which kind of pointer events you wish 
  //                  to handle ie. ['mouse', 'touch', 'pen']

  var module = angular.module('mobile-angular-ui.gestures.touch', []);

  module.provider('$touch', function() {

    /*=====================================
    =            Configuration            =
    =====================================*/

    var VALID = function() {
      return true;
    };
    
    var MOVEMENT_THRESHOLD = 1;

    var POINTER_EVENTS = {
      'mouse': {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      },
      'touch': {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel'
      }
    };

    var POINTER_TYPES = ['mouse', 'touch'];

    // function or element or rect
    var SENSITIVE_AREA = function($element) {
      return $element[0].ownerDocument.documentElement.getBoundingClientRect();
    };

    this.setPointerEvents = function(pe) {
      POINTER_EVENTS = pe;
    };

    this.setPointerTypes = function(pt) {
      POINTER_EVENTS = pt;
    };

    this.setValid = function(fn) {
      VALID = fn;
    };

    this.setMovementThreshold = function(v) {
      MOVEMENT_THRESHOLD = v;
    };

    this.setSensitiveArea = function(fnOrElementOrRect) {
      SENSITIVE_AREA = fnOrElementOrRect;
    };

    // 
    // Shorthands for minification
    //
    var abs = Math.abs,
        atan2 = Math.atan2,
        sqrt = Math.sqrt;

    /*===============================
    =            Helpers            =
    ===============================*/

    var getCoordinates = function(event) {
      var touches = event.touches && event.touches.length ? event.touches : [event];
      var e = (event.changedTouches && event.changedTouches[0]) ||
          (event.originalEvent && event.originalEvent.changedTouches &&
              event.originalEvent.changedTouches[0]) ||
          touches[0].originalEvent || touches[0];

      return {
        x: e.clientX,
        y: e.clientY
      };
    };

    var getEvents = function(pointerTypes, eventType) {
      var res = [];
      angular.forEach(pointerTypes, function(pointerType) {
        var eventName = POINTER_EVENTS[pointerType][eventType];
        if (eventName) {
          res.push(eventName);
        }
      });
      return res.join(' ');
    };

    var now = function() { 
      return new Date();
    };

    var timediff = function(t1, t2) {
      t2 = t2 || now();
      return abs(t2 - t1);
    };

    var len = function(x, y) {
      return sqrt(x*x + y*y);
    };

    // Compute values for new TouchInfo based on coordinates and previus touches.
    // - c is coords of new touch
    // - t0 is first touch: useful to compute duration and distance (how far pointer 
    //                    got from first touch)
    // - tl is last touch: useful to compute velocity and length (total length of the movement)
    var buildTouchInfo = function(type, c, t0, tl) {
      t0 = t0 || {}; 
      tl = tl || {}; 

      var // timestamps  
          ts = now(), ts0 = t0.timestamp || ts, tsl = tl.timestamp || ts0,
          // coords
          x = c.x, y = c.y, x0 = t0.x || x, y0 = t0.y || y, xl = tl.x || x0, yl = tl.y || y0,
          // total movement
          totalXl = tl.totalX || 0, totalYl = tl.totalY || 0, 
          totalX = totalXl + abs(x - xl), totalY = totalYl + abs(y - yl), 
          total = len(totalX, totalY),
          // duration
          duration = timediff(ts, ts0),
          durationl = timediff(ts, tsl),
          // distance
          dxl = x - xl, dyl = y - yl, dl = len(dxl, dyl),
          dx = x - x0, dy = y - y0, d = len(dx, dy),
          // velocity (px per second)
          v = durationl > 0 ? abs(dl / ( durationl / 1000 )) : 0,
          tv = duration > 0 ? abs(total / (duration / 1000)) : 0,
          // main direction: 'LEFT', 'RIGHT', 'TOP', 'BOTTOM'
          dir = abs(dx) > abs(dy) ?
            (dx < 0 ? 'LEFT' : 'RIGHT'):
            (dy < 0 ? 'TOP' : 'BOTTOM'),
          // angle (angle between distance vector and x axis)
          // angle will be:
          //  0 for x > 0 and y = 0
          //  90 for y < 0 and x = 0
          //  180 for x < 0 and y = 0
          //  -90 for y > 0 and x = 0
          //  
          //              -90°
          //               |
          //               |
          //               |
          //  180° --------|-------- 0°
          //               |
          //               |
          //               |
          //              90°
          //          
          angle = dx !== 0 || dy !== 0  ? atan2(dy, dx) * (180 / Math.PI) : null;
          angle = angle === -180 ? 180 : angle;

      return {
        type: type,
        timestamp: ts,
        duration: duration,
        startX: x0,
        startY: y0,
        prevX: xl,
        prevY: yl,
        x: c.x,
        y: c.y,

        step:  dl, // distance from prev
        stepX: dxl,
        stepY: dyl,

        velocity: v,
        averageVelocity: tv,
        
        distance: d, // distance from start
        distanceX: dx,
        distanceY: dy,

        total: total, // total length of momement,
                      // considering turnaround
        totalX: totalX,
        totalY: totalY,
        direction: dir,
        angle: angle
      };
    };

    /*======================================
    =            Factory Method            =
    ======================================*/

    this.$get = [function() {
      
      return {
        bind: function($element, eventHandlers, options) {

          // ensure element to be an angular element 
          $element = angular.element($element);
          
          options = options || {};
          // uses default pointer types in case of none passed
          var pointerTypes = options.pointerTypes || POINTER_TYPES,
              isValid = options.valid === undefined ? VALID : options.valid,
              movementThreshold = options.movementThreshold === undefined ? MOVEMENT_THRESHOLD : options.valid,
              sensitiveArea = options.sensitiveArea === undefined ? SENSITIVE_AREA : options.sensitiveArea;

          var // first and last touch
              t0, tl,
              // events
              startEvents = getEvents(pointerTypes, 'start'),
              endEvents = getEvents(pointerTypes, 'end'),
              moveEvents = getEvents(pointerTypes, 'move'),
              cancelEvents = getEvents(pointerTypes, 'cancel');

          var startEventHandler = eventHandlers.start,
              endEventHandler = eventHandlers.end,
              moveEventHandler = eventHandlers.move,
              cancelEventHandler = eventHandlers.cancel;

          var $movementTarget = angular.element($element[0].ownerDocument);

          var resetTouch = function() {
            t0 = tl = null;
            $movementTarget.off(moveEvents, onTouchMove);
            $movementTarget.off(endEvents, onTouchEnd);
            if (cancelEvents) { $movementTarget.off(cancelEvents, onTouchCancel); }
          };

          var isActive = function() {
            return !!t0;
          };

          // 
          // Callbacks
          // 

          // on touchstart
          var onTouchStart = function(event) {
            tl = t0 = buildTouchInfo('touchstart', getCoordinates(event));
            $movementTarget.on(moveEvents, onTouchMove);
            $movementTarget.on(endEvents, onTouchEnd);
            if (cancelEvents) { $movementTarget.on(cancelEvents, onTouchCancel); }
            if (startEventHandler) {
              startEventHandler(t0, event); 
            }
          };

          // on touchCancel
          var onTouchCancel = function(event) {
            var t = buildTouchInfo('touchcancel', getCoordinates(event), t0, tl);
            resetTouch();
            if (cancelEventHandler) {
              cancelEventHandler(t, event);
            }
          };

          // on touchMove
          var onTouchMove = function(event) {
            if (!isActive()) { return; }
            
            var coords = getCoordinates(event);

            // 
            // wont fire outside sensitive area
            // 
            var mva = typeof sensitiveArea === 'function' ? sensitiveArea($element) : sensitiveArea;
            mva = mva.length ? mva[0] : mva;
            
            var mvaRect = mva instanceof Element ? mva.getBoundingClientRect() : mva;

            if (coords.x < mvaRect.left || coords.x > mvaRect.right || coords.y < mvaRect.top || coords.y > mvaRect.bottom){ return; }

            var t = buildTouchInfo('touchmove', coords, t0, tl),
                totalX = t.totalX,
                totalY = t.totalY;

            tl = t;
    
            if (totalX < movementThreshold && totalY < movementThreshold) {
              return;
            }

            if (isValid(t, event)) {
              if (event.cancelable === undefined || event.cancelable) {
                event.preventDefault();              
              }
              if (moveEventHandler) {
                moveEventHandler(t, event);
              }
            }
          };

          // on touchEnd
          var onTouchEnd = function(event) {
            if (!isActive()) { return; }
            var t = angular.extend({}, tl, {type: 'touchend'});
            if (isValid(t, event)) {
              if (event.cancelable === undefined || event.cancelable) {
                event.preventDefault();              
              }
              if (endEventHandler) {
                setTimeout(function() { // weird workaround to avoid 
                                        // delays with dom manipulations
                                        // inside the handler
                  endEventHandler(t, event);
                }, 0);
              }
            }
            resetTouch();
          };

          $element.on(startEvents, onTouchStart);

          return function unbind() {
            if ($element) { // <- wont throw if accidentally called twice
              $element.off(startEvents, onTouchStart);
              if (cancelEvents) { $movementTarget.off(cancelEvents, onTouchCancel); }
              $movementTarget.off(moveEvents, onTouchMove);
              $movementTarget.off(endEvents, onTouchEnd);

              // Clear all those variables we carried out from `#bind` method scope
              // to local scope and that we don't have to use anymore
              $element = $movementTarget = startEvents = cancelEvents = moveEvents = endEvents = onTouchStart = onTouchCancel = onTouchMove = onTouchEnd = pointerTypes = isValid = movementThreshold = sensitiveArea = null;
            }
          };
        }
      };
    }];
  });
}());
(function() {
  'use strict';
  
  var module = angular.module('mobile-angular-ui.gestures.transform', []);

  // $transform Service is designed with the specific aim to provide a cross-browser way to
  // interpolate CSS 3d transform without having to deal with CSS Matrix, and being able
  // to take into account any previous unknown transform already applied to an element.
  // 
  // Usage
  // 
  // ``` css
  // .myelem {
  //   transform: translate(12px) rotate(20deg);
  // }
  // ```
  // 
  // ``` html
  // <div class='myelem'></div>
  // ```
  // 
  // ``` js
  //   t = $transform.get(e);
  //   t.rotationZ += 15;
  //   t.translateX += 1;
  //   $transform.set(e, t);
  // ```
  module.factory('$transform', function(){

    /*==============================================================
    =            Cross-Browser Property Prefix Handling            =
    ==============================================================*/

    // Cross-Browser style properties
    var cssPrefix,
        transformProperty,
        styleProperty,
        prefixes = ['', 'webkit', 'Moz', 'O', 'ms'],
        d = document.createElement('div');
    
    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      if ( (prefix + 'Perspective') in d.style ) {
        cssPrefix = (prefix === '' ? '' : '-' + prefix.toLowerCase() + '-');
        styleProperty = prefix + (prefix === '' ? 'transform' : 'Transform');
        transformProperty = cssPrefix + 'transform';
        break;
      }
    }

    d = null;

    // return current element transform matrix in a cross-browser way
    var getElementTransformProperty = function(e) {
      e = e.length ? e[0] : e;
      var tr = window
              .getComputedStyle(e, null)
              .getPropertyValue(transformProperty);
      return tr;
    };

    // set current element transform matrix in a cross-browser way
    var setElementTransformProperty = function(elem, value) {
      elem = elem.length ? elem[0] : elem;
      elem.style[styleProperty] = value;
    };

    /*======================================================
    =            Transform Matrix Decomposition            =
    ======================================================*/

    var SMALL_NUMBER = 1.e-7;

    var rad2deg = function(angle) {
      return angle * 180 / Math.PI;
    };

    var sqrt = Math.sqrt,
        asin = Math.asin,
        atan2 = Math.atan2,
        cos = Math.cos,
        abs = Math.abs,
        floor = Math.floor;

    var cloneMatrix = function(m) {
      var res = [[],[],[],[]];
      for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[i].length; j++) {
          res[i][j] = m[i][j];
        }
      }
      return res;
    };

    var determinant2x2 = function(a, b, c, d) {
       return a * d - b * c;
    };

    var determinant3x3 = function(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
      return a1 * determinant2x2(b2, b3, c2, c3) - b1 * determinant2x2(a2, a3, c2, c3) + c1 * determinant2x2(a2, a3, b2, b3);  
    };

    var determinant4x4 = function(m) {
      var a1 = m[0][0], b1 = m[0][1], c1 = m[0][2], d1 = m[0][3], a2 = m[1][0], b2 = m[1][1], c2 = m[1][2], d2 = m[1][3], a3 = m[2][0], b3 = m[2][1], c3 = m[2][2], d3 = m[2][3], a4 = m[3][0], b4 = m[3][1], c4 = m[3][2], d4 = m[3][3];
      return a1 * determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4) - b1 * determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4) + c1 * determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4) - d1 * determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
    };

    var adjoint = function(m) {
      var res = [[],[],[],[]], a1 = m[0][0], b1 = m[0][1], c1 = m[0][2], d1 = m[0][3], a2 = m[1][0], b2 = m[1][1], c2 = m[1][2], d2 = m[1][3], a3 = m[2][0], b3 = m[2][1], c3 = m[2][2], d3 = m[2][3], a4 = m[3][0], b4 = m[3][1], c4 = m[3][2], d4 = m[3][3];

      res[0][0]  =   determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4);
      res[1][0]  = - determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4);
      res[2][0]  =   determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4);
      res[3][0]  = - determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
      res[0][1]  = - determinant3x3(b1, b3, b4, c1, c3, c4, d1, d3, d4);
      res[1][1]  =   determinant3x3(a1, a3, a4, c1, c3, c4, d1, d3, d4);
      res[2][1]  = - determinant3x3(a1, a3, a4, b1, b3, b4, d1, d3, d4);
      res[3][1]  =   determinant3x3(a1, a3, a4, b1, b3, b4, c1, c3, c4);
      res[0][2]  =   determinant3x3(b1, b2, b4, c1, c2, c4, d1, d2, d4);
      res[1][2]  = - determinant3x3(a1, a2, a4, c1, c2, c4, d1, d2, d4);
      res[2][2]  =   determinant3x3(a1, a2, a4, b1, b2, b4, d1, d2, d4);
      res[3][2]  = - determinant3x3(a1, a2, a4, b1, b2, b4, c1, c2, c4);
      res[0][3]  = - determinant3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
      res[1][3]  =   determinant3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
      res[2][3]  = - determinant3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
      res[3][3]  =   determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);

      return res;
    };

    var inverse = function(m) {
      var res = adjoint(m),
          det = determinant4x4(m);
      if (abs(det) < SMALL_NUMBER) { return false; }
      
      for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 4; j++) {
              res[i][j] = res[i][j] / det;
          }
      }
      return res;
    };

    var transposeMatrix4 = function(m) {
      var res = [[],[],[],[]];
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          res[i][j] = m[j][i];
        }
      }
      return res;
    };

    var v4MulPointByMatrix = function(p, m) {
      var res = [];

      res[0] = (p[0] * m[0][0]) + (p[1] * m[1][0]) +
                  (p[2] * m[2][0]) + (p[3] * m[3][0]);
      res[1] = (p[0] * m[0][1]) + (p[1] * m[1][1]) +
                  (p[2] * m[2][1]) + (p[3] * m[3][1]);
      res[2] = (p[0] * m[0][2]) + (p[1] * m[1][2]) +
                  (p[2] * m[2][2]) + (p[3] * m[3][2]);
      res[3] = (p[0] * m[0][3]) + (p[1] * m[1][3]) +
                  (p[2] * m[2][3]) + (p[3] * m[3][3]);

      return res;
    };

    var v3Length = function(a) {
      return sqrt((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]));
    };

    var v3Scale = function(v, desiredLength) {
      var res = [], len = v3Length(v);
      if (len !== 0) {
          var l = desiredLength / len;
          res[0] *= l;
          res[1] *= l;
          res[2] *= l;
      }
      return res;
    };

    var v3Dot = function(a, b){
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    };

    var v3Combine = function(a, b, ascl, bscl) {
      var res = [];
      res[0] = (ascl * a[0]) + (bscl * b[0]);
      res[1] = (ascl * a[1]) + (bscl * b[1]);
      res[2] = (ascl * a[2]) + (bscl * b[2]);
      return res;
    };

    var v3Cross = function(a, b) {
      var res = [];
      res[0] = (a[1] * b[2]) - (a[2] * b[1]);
      res[1] = (a[2] * b[0]) - (a[0] * b[2]);
      res[2] = (a[0] * b[1]) - (a[1] * b[0]);
      return res;
    };

    var decompose = function(mat) {
      var result = {}, localMatrix = cloneMatrix(mat), i, j;
      
      // Normalize the matrix.
      if (localMatrix[3][3] === 0) {
        return false;
      }

      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          localMatrix[i][j] /= localMatrix[3][3];
        }
      }

      var perspectiveMatrix = cloneMatrix(localMatrix);
      for (i = 0; i < 3; i++) {
        perspectiveMatrix[i][3] = 0;
      }
      perspectiveMatrix[3][3] = 1;

      if (determinant4x4(perspectiveMatrix) === 0) {
        return false;
      }

      // First, isolate perspective.  This is the messiest.
      if (localMatrix[0][3] !== 0 || localMatrix[1][3] !== 0 || localMatrix[2][3] !== 0) {
          // rightHandSide is the right hand side of the equation.
          var rightHandSide = [];
          rightHandSide[0] = localMatrix[0][3];
          rightHandSide[1] = localMatrix[1][3];
          rightHandSide[2] = localMatrix[2][3];
          rightHandSide[3] = localMatrix[3][3];

          // Solve the equation by inverting perspectiveMatrix and multiplying
          // rightHandSide by the inverse. (This is the easiest way, not
          // necessarily the best.)
          var inversePerspectiveMatrix = inverse(perspectiveMatrix);
          var transposedInversePerspectiveMatrix = transposeMatrix4(inversePerspectiveMatrix);
          var perspectivePoint = v4MulPointByMatrix(rightHandSide, transposedInversePerspectiveMatrix);

          result.perspectiveX = perspectivePoint[0];
          result.perspectiveY = perspectivePoint[1];
          result.perspectiveZ = perspectivePoint[2];
          result.perspectiveW = perspectivePoint[3];
          
          // Clear the perspective partition
          localMatrix[0][3] = localMatrix[1][3] = localMatrix[2][3] = 0;
          localMatrix[3][3] = 1;
      } else {
          // No perspective.
          result.perspectiveX = result.perspectiveY = result.perspectiveZ = 0;
          result.perspectiveW = 1;
      }

      // Next take care of translation (easy).
      result.translateX = localMatrix[3][0];
      localMatrix[3][0] = 0;
      result.translateY = localMatrix[3][1];
      localMatrix[3][1] = 0;
      result.translateZ = localMatrix[3][2];
      localMatrix[3][2] = 0;

      // Now get scale and shear.
      var row = [[],[],[]], pdum3;
      
      for (i = 0; i < 3; i++) {
          row[i][0] = localMatrix[i][0];
          row[i][1] = localMatrix[i][1];
          row[i][2] = localMatrix[i][2];
      }

      // Compute X scale factor and normalize first row.
      result.scaleX = v3Length(row[0]);
      v3Scale(row[0], 1.0);

      // Compute XY shear factor and make 2nd row orthogonal to 1st.
      result.skewXY = v3Dot(row[0], row[1]);
      v3Combine(row[1], row[0], row[1], 1.0, -result.skewXY);

      // Now, compute Y scale and normalize 2nd row.
      result.scaleY = v3Length(row[1]);
      v3Scale(row[1], 1.0);
      result.skewXY /= result.scaleY;

      // Compute XZ and YZ shears, orthogonalize 3rd row.
      result.skewXZ = v3Dot(row[0], row[2]);
      v3Combine(row[2], row[0], row[2], 1.0, -result.skewXZ);
      result.skewYZ = v3Dot(row[1], row[2]);
      v3Combine(row[2], row[1], row[2], 1.0, -result.skewYZ);

      // Next, get Z scale and normalize 3rd row.
      result.scaleZ = v3Length(row[2]);
      v3Scale(row[2], 1.0);
      result.skewXZ /= result.scaleZ;
      result.skewYZ /= result.scaleZ;
      
      // At this point, the matrix (in rows[]) is orthonormal.
      // Check for a coordinate system flip.  If the determinant
      // is -1, then negate the matrix and the scaling factors.
      pdum3 = v3Cross(row[1], row[2]);
      
      if (v3Dot(row[0], pdum3) < 0) {
          for (i = 0; i < 3; i++) {
              result.scaleX *= -1;
              row[i][0] *= -1;
              row[i][1] *= -1;
              row[i][2] *= -1;
          }
      }

      // Rotation (angles smaller then SMALL_NUMBER are zeroed)
      result.rotateY = rad2deg(asin(-row[0][2]))  || 0;
      if (cos(result.rotateY) !== 0) {
        result.rotateX = rad2deg(atan2(row[1][2], row[2][2]))  || 0;
        result.rotateZ = rad2deg(atan2(row[0][1], row[0][0]))  || 0;
      } else {
        result.rotateX = rad2deg(atan2(-row[2][0], row[1][1])) || 0;
        result.rotateZ = 0;
      }

      return result;
    };

    /*=========================================
    =            Factory interface            =
    =========================================*/

    var fCom = function(n, def) {
      // avoid scientific notation with toFixed
      var val = (n || def || 0);
      return '' + val.toFixed(20);
    };

    var fPx = function(n, def) {
      return fCom(n, def) + 'px';
    };

    var fDeg = function(n, def) {
      return fCom(n, def) + 'deg';
    };

    return {
      fromCssMatrix: function(tr) {
        var M = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

        // Just returns identity in case no transform is setup for the element
        if (tr && tr !== 'none') { 
          var elems = tr.split('(')[1].split(')')[0].split(',').map(Number);

          // Is a 2d transform: matrix(a, b, c, d, tx, ty) is a shorthand 
          // for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
          if (tr.match(/^matrix\(/)) {
            M[0][0] = elems[0];
            M[1][0] = elems[1];
            M[0][1] = elems[2];
            M[1][1] = elems[3];
            M[3][0] = elems[4];
            M[3][1] = elems[5];

          // Is a 3d transform, set elements by rows
          } else {
            for (var i = 0; i < 16; i++) {
              var row = floor(i / 4),
                  col = i % 4;
              M[row][col] = elems[i];
            }
          }
        }
        return decompose(M);
      },

      toCssMatrix: function(t) {
        // 
        // Transforms are recomposed as a composition of:
        // 
        // matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, perspective[0], perspective[1], perspective[2], perspective[3])
        // translate3d(translation[0], translation[1], translation[2])
        // rotateX(rotation[0]) rotateY(rotation[1]) rotateZ(rotation[2])
        // matrix3d(1,0,0,0, 0,1,0,0, 0,skew[2],1,0, 0,0,0,1)
        // matrix3d(1,0,0,0, 0,1,0,0, skew[1],0,1,0, 0,0,0,1)
        // matrix3d(1,0,0,0, skew[0],1,0,0, 0,0,1,0, 0,0,0,1)
        // scale3d(scale[0], scale[1], scale[2])
        // 
        
        var perspective = [
          fCom(t.perspectiveX),
          fCom(t.perspectiveY),
          fCom(t.perspectiveZ),
          fCom(t.perspectiveW, 1)
        ],
        translate = [
          fPx(t.translateX), 
          fPx(t.translateY), 
          fPx(t.translateZ)
        ],
        scale = [
          fCom(t.scaleX), 
          fCom(t.scaleY),
          fCom(t.scaleZ)
        ],
        rotation = [
          fDeg(t.rotateX),
          fDeg(t.rotateY),
          fDeg(t.rotateZ)
        ],
        skew = [
          fCom(t.skewXY),
          fCom(t.skewXZ),
          fCom(t.skewYZ)
        ];
        
        return [
          'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + perspective.join(',') + ')',
          'translate3d(' + translate.join(',') + ')',
          'rotateX('+ rotation[0] + ') rotateY(' + rotation[1] + ') rotateZ(' + rotation[2] + ')',
          'matrix3d(1,0,0,0,0,1,0,0,0,' + skew[2] + ',1,0,0,0,0,1)',
          'matrix3d(1,0,0,0,0,1,0,0,' + skew[1] + ',0,1,0,0,0,0,1)',
          'matrix3d(1,0,0,0,' + skew[0] + ',1,0,0,0,0,1,0,0,0,0,1)',
          'scale3d(' + scale.join(',') + ')'
        ].join(' ');
      },

      // 
      // Returns a decomposition of the transform matrix applied
      // to `e`;
      //  
      // NOTE: 2d matrices are translated to 3d matrices
      //       before any other operation.
      //       
      get: function(e) {
        return this.fromCssMatrix(getElementTransformProperty(e));
      },

      // Recompose a transform from decomposition `t` and apply it to element `e`
      set: function(e, t) {
        var str = (typeof t === 'string') ? t : this.toCssMatrix(t);
        setElementTransformProperty(e, str);  
      }
    };
  });
}());
(function () {
   'use strict';

   angular.module('mobile-angular-ui.gestures', [
     'mobile-angular-ui.gestures.drag',
     'mobile-angular-ui.gestures.swipe',
     'mobile-angular-ui.gestures.transform'
   ]);

}());