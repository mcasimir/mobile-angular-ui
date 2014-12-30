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
  // - preventScroll: (fn->bool or bool) wether yield to scroll or prevent it
  // - pointerTypes: (array) which kind of pointer events you wish 
  //                  to handle ie. ['mouse', 'touch', 'pen']

  var module = angular.module('mobile-angular-ui.gestures.touch', []);

  module.provider('$touch', function() {

    /*=====================================
    =            Configuration            =
    =====================================*/

    var PREVENT_SCROLL = true;
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

    // if set to `true` emulates behaviour of touchmove so
    // it will continue after touch goes outside element,
    // bear in mind that disabling this may lead
    // to inconsistencies between devices
    var ALLOW_OUTER_MOVEMENT = true;

    this.setPointerEvents = function(pe) {
      POINTER_EVENTS = pe;
    };

    this.setPointerTypes = function(pt) {
      POINTER_EVENTS = pt;
    };

    this.setPreventScroll = function(v) {
      PREVENT_SCROLL = v;
    };

    this.setMovementThreshold = function(v) {
      MOVEMENT_THRESHOLD = v;
    };

    this.setAllowOuterMovement = function(v) {
      ALLOW_OUTER_MOVEMENT = !!v;
    };

    // 
    // Shorthands for minification
    //
    var abs = Math.abs,
        asin = Math.asin,
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
          // direction (angle between distance vector and x axis)
          // given as the arcsin of normalized direction vector in degrees
          dir = d !== 0 ? asin(dy/d) * (180 / Math.PI) : null;

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
        
        distance: d, // distance from start
        distanceX: dx,
        distanceY: dy,

        total: total, // total length of momement,
                      // considering turnaround
        totalX: totalX,
        totalY: totalY,

        direction: dir
      };
    };

    /*======================================
    =            Factory Method            =
    ======================================*/

    this.$get = ['$document', function($document) {
      
      return {
        bind: function($element, eventHandlers, options) {

          // ensure element to be an angular element 
          $element = angular.element($element);
          
          options = options || {};
          // uses default pointer types in case of none passed
          var pointerTypes = options.pointerTypes || POINTER_TYPES,
              preventScroll = options.preventScroll === undefined ? PREVENT_SCROLL : options.preventScroll,
              movementThreshold = options.movementThreshold === undefined ? MOVEMENT_THRESHOLD : options.preventScroll,
              allowOuterMovement = options.allowOuterMovement === undefined ? ALLOW_OUTER_MOVEMENT : options.allowOuterMovement;

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

          var $movementTarget = allowOuterMovement ? $document : $element;

          var resetTouch = function() {
            t0 = tl = null;
            $movementTarget.off(moveEvents, onTouchMove);
            $movementTarget.off(endEvents, onTouchEnd);
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

            // wont fire outside the window
            if (coords.x < 0 || coords.x > window.innerWidth || coords.y < 0 || coords.y > window.innerHeight){ return; }

            var t = buildTouchInfo('touchmove', coords, t0, tl),
                totalX = t.totalX,
                totalY = t.totalY;

            tl = t;
    
            if (totalX < movementThreshold && totalY < movementThreshold) {
              return;
            }
            
            var shouldPreventScroll = typeof preventScroll === 'function' ? preventScroll(t) : preventScroll;

            if (shouldPreventScroll) {
              event.preventDefault();
            } else {
              resetTouch();
              if (cancelEventHandler) {
                cancelEventHandler(t, event);
              }
              return;
            }

            if (moveEventHandler) {
              moveEventHandler(t, event);
            }
          };

          // on touchEnd
          var onTouchEnd = function(event) {
            if (!isActive()) { return; }
            var tlbkp = tl;
            if (endEventHandler) {
              setTimeout(function() {
                endEventHandler(angular.extend({}, tlbkp, {type: 'touchend'}), event);
              }, 0);
            }  
            resetTouch();
          };


          $element.on(startEvents, onTouchStart);
          if (cancelEvents) { $element.on(cancelEvents, onTouchCancel); }

          return function unbind() {
            if ($element) { // <- wont throw if accidentally called twice
              $element.off(startEvents, onTouchStart);
              if (cancelEvents) { $element.off(cancelEvents, onTouchCancel); }
              $movementTarget.off(moveEvents, onTouchMove);
              $movementTarget.off(endEvents, onTouchEnd);

              // Clear all those variables we carried out from `#bind` method scope
              // to local scope and that we don't have to use anymore
              $element = $movementTarget = startEvents = cancelEvents = moveEvents = endEvents = onTouchStart = onTouchCancel = onTouchMove = onTouchEnd = pointerTypes = preventScroll = movementThreshold = allowOuterMovement = null;
            }
          };
        }
      };
    }];
  });
}());