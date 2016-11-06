/* eslint complexity: 0 */

/**
 * Device agnostic touch handling.
 *
 * **Usage**
 *
 * Require this module doing either
 *
 * ``` js
 * angular.module('myApp', ['mobile-angular-ui.gestures']);
 * ```
 *
 * Or standalone
 *
 * ``` js
 * angular.module('myApp', ['mobile-angular-ui.gestures.touch']);
 * ```
 *
 * Then you will be able to use the `$touch` service like that:
 *
 * ``` js
 * var unbindFn = $touch.bind(element, {
 *    start: function(touchInfo, e);
 *    move: function(touchInfo, e);
 *    end: function(touchInfo, e);
 *    cancel: function(touchInfo, e);
 * }, options);
 * ```
 *
 * @module mobile-angular-ui.gestures.touch
 */
(function() {
  'use strict';
  var module = angular.module('mobile-angular-ui.gestures.touch', []);

  /**
   * `$touch` is an abstraction of touch event handling that works with
   * any kind of input devices.
   *
   * It is intended for single touch only and provides
   * extended infos about touch like: movement, direction, velocity, duration, and more.
   * $touch service is intended as base to build any single-touch gesture handlers.
   *
   * **Usage**
   *
   * ``` js
   * var unbindFn = $touch.bind(element, {
   *    start: function(touchInfo, e);
   *    move: function(touchInfo, e);
   *    end: function(touchInfo, e);
   *    cancel: function(touchInfo, e);
   * }, options);
   * ```
   *
   * @service $touch
   * @as class
   */

  /**
   * Configurable provider for `$touch` service
   * @class  $touchProvider
   * @ngdoc  provider
   * @memberOf mobile-angular-ui.gestures.touch~$touch
   */
  module.provider('$touch', function() {

    /* =====================================
    =            Configuration            =
    =====================================*/

    var VALID = function() {
      return true;
    };

    var MOVEMENT_THRESHOLD = 1;

    var POINTER_EVENTS = {
      mouse: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      },
      touch: {
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

    /**
     * Set default pointer events option.
     * Pointer Events option specifies a device-by-device map between device specific events and
     * touch events.
     *
     * The default Pointer Events Map is defined as:
     *
     * ``` js
     * var POINTER_EVENTS = {
     *   'mouse': {
     *     start: 'mousedown',
     *     move: 'mousemove',
     *     end: 'mouseup'
     *   },
     *   'touch': {
     *     start: 'touchstart',
     *     move: 'touchmove',
     *     end: 'touchend',
     *     cancel: 'touchcancel'
     *   }
     * };
     * ```
     *
     * Ie.
     *
     * ```
     * app.config(function($touchProvider){
     *   $touchProvider.setPointerEvents({ pen: {start: "pendown", end: "penup", move: "penmove" }});
     * });
     * ```
     *
     * @name setPointerEvents
     * @param {object} pointerEvents The pointer events map object
     * @memberOf mobile-angular-ui.gestures.touch~$touch.$touchProvider
     */
    this.setPointerEvents = function(pointerEvents) {
      POINTER_EVENTS = pointerEvents;
      POINTER_TYPES = Object.keys(POINTER_EVENTS);
    };

    /**
     * Set default validity function for a touch.
     *
     * The default is defined as always true:
     *
     * ``` js
     * $touchProvider.setValid(function(touch, event) {
     *   return true;
     * });
     * ```
     *
     * @param {function} validityFunction The validity function. A function that takes two
     *                   arguments: `touchInfo` and `event`, and returns
     *                   a `Boolean` indicating wether the corresponding touch
     *                   should be considered valid and its handlers triggered,
     *                   or considered invalid and its handlers be ignored.
     * @method setValid
     * @memberOf mobile-angular-ui.gestures.touch~$touch.$touchProvider
     */
    this.setValid = function(fn) {
      VALID = fn;
    };

    /**
     * Set default amount of pixels of movement before
     * start to trigger `touchmove` handlers.
     *
     * Default is `1`.
     *
     * ie.
     *
     * ``` js
     * $touchProvider.setMovementThreshold(120);
     * ```
     *
     * @param {integer}  threshold The new treeshold.
     *
     * @method  setMovementThreshold
     * @memberOf mobile-angular-ui.gestures.touch~$touch.$touchProvider
     */
    this.setMovementThreshold = function(v) {
      MOVEMENT_THRESHOLD = v;
    };
    /**
     * Set default sensitive area.
     *
     * The sensitive area of a touch is the area of the screen inside what
     * we consider a touch to be meaningful thus triggering its handlers.
     *
     * **NOTE:** if movement goes out the sensitive area the touch event is not cancelled,
     * instead its handler are just ignored.
     *
     * By default sensitive area is defined as `ownerDocument` bounding rectangle
     * of the bound element.
     *
     * ie.
     *
     * ``` js
     * $touchProvider.setSensitiveArea(function($element) {
     *   return $element[0].ownerDocument.documentElement.getBoundingClientRect();
     * });
     * ```
     *
     * @param {function|Element|TextRectangle} sensitiveArea The new default sensitive area,
     *                                                       either static or as function
     *                                                       taking an element and returning another
     *                                                       element or a
     *                                                       [rectangle](https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect).
     *
     * @method  setSensitiveArea
     * @memberOf mobile-angular-ui.gestures.touch~$touch.$touchProvider
     */
    this.setSensitiveArea = function(fnOrElementOrRect) {
      SENSITIVE_AREA = fnOrElementOrRect;
    };

    //
    // Shorthands for minification
    //
    var abs = Math.abs;
    var atan2 = Math.atan2;
    var sqrt = Math.sqrt;

    /* ===============================
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
      return sqrt(x * x + y * y);
    };

    /**
     * `TouchInfo` is an object containing the following extended informations about any touch
     * event.
     *
     * @property {string} type Normalized event type. Despite of pointer device is always one of `touchstart`, `touchend`, `touchmove`, `touchcancel`.
     * @property {Date} timestamp The time object corresponding to the moment this touch event happened.
     * @property {integer} duration The difference between this touch event and the corresponding `touchstart`.
     * @property {float} startX X coord of related `touchstart`.
     * @property {float} startY Y coord of related `touchstart`.
     * @property {float} prevX X coord of previous `touchstart` or `touchmove`.
     * @property {float} prevY Y coord of previous `touchstart` or `touchmove`.
     * @property {float} x X coord of this touch event.
     * @property {float} y Y coord of this touch event.
     * @property {float} step Distance between `[prevX, prevY]` and `[x, y]` points.
     * @property {float} stepX Distance between `prevX` and `x`.
     * @property {float} stepY Distance between `prevY` and `y`.
     * @property {float} velocity Instantaneous velocity of a touch event in pixels per second.
     * @property {float} averageVelocity Average velocity of a touch event from its corresponding `touchstart` in pixels per second.
     * @property {float} distance Distance between `[startX, startY]` and `[x, y]` points.
     * @property {float} distanceX Distance between `startX` and `x`.
     * @property {float} distanceY Distance between `startY` and `y`.
     * @property {float} total Total number of pixels covered by movement, taking account of direction changes and turnarounds.
     * @property {float} totalX Total number of pixels covered by horizontal movement, taking account of direction changes and turnarounds.
     * @property {float} totalY Total number of pixels covered by vertical, taking account of direction changes and turnarounds.
     * @property {string} direction The current prevalent direction for this touch, one of `LEFT`, `RIGHT`, `TOP`, `BOTTOM`.
     * @property {float} angle Angle in degree between x axis and the vector `[x, y]`, is `null` when no movement happens.
     *
     * @class TouchInfo
     * @ngdoc type
     * @memberOf mobile-angular-ui.gestures.touch~$touch
     */

    var buildTouchInfo = function(type, c, t0, tl) {
      // Compute values for new TouchInfo based on coordinates and previus touches.
      // - c is coords of new touch
      // - t0 is first touch: useful to compute duration and distance (how far pointer
      //                    got from first touch)
      // - tl is last touch: useful to compute velocity and length (total length of the movement)

      t0 = t0 || {};
      tl = tl || {};

      // timestamps
      var ts = now();
      var ts0 = t0.timestamp || ts;
      var tsl = tl.timestamp || ts0;

      // coords
      var x = c.x;
      var y = c.y;
      var x0 = t0.x || x;
      var y0 = t0.y || y;
      var xl = tl.x || x0;
      var yl = tl.y || y0;

      // total movement
      var totalXl = tl.totalX || 0;
      var totalYl = tl.totalY || 0;
      var totalX = totalXl + abs(x - xl);
      var totalY = totalYl + abs(y - yl);
      var total = len(totalX, totalY);

      // duration
      var duration = timediff(ts, ts0);
      var durationl = timediff(ts, tsl);

      // distance
      var dxl = x - xl;
      var dyl = y - yl;
      var dl = len(dxl, dyl);
      var dx = x - x0;
      var dy = y - y0;
      var d = len(dx, dy);

      // velocity (px per second)
      var v = durationl > 0 ? abs(dl / (durationl / 1000)) : 0;
      var tv = duration > 0 ? abs(total / (duration / 1000)) : 0;

      // main direction: 'LEFT', 'RIGHT', 'TOP', 'BOTTOM'
      var dir = abs(dx) > abs(dy) ?
        (dx < 0 ? 'LEFT' : 'RIGHT') :
        (dy < 0 ? 'TOP' : 'BOTTOM');

      // angle (angle between distance vector and x axis)
      // angle will be:
      //   0 for x > 0 and y = 0
      //   90 for y < 0 and x = 0
      //   180 for x < 0 and y = 0
      //   -90 for y > 0 and x = 0
      //
      //               -90°
      //                |
      //                |
      //                |
      //   180° --------|-------- 0°
      //                |
      //                |
      //                |
      //               90°
      //
      var angle = dx !== 0 || dy !== 0 ? atan2(dy, dx) * (180 / Math.PI) : null;
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

        step: dl, // distance from prev
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

    /* ======================================
    =            Factory Method            =
    ======================================*/

    this.$get = [function() {

      return {
        /**
         *
         * Bind touch handlers for an element.
         *
         * ``` js
         * var unbind = $touch.bind(elem, {
         *   end: function(touch) {
         *     console.log('Avg Speed:', touch.averageVelocity);
         *     unbind();
         *   }
         * });
         * ```
         *
         * @param  {Element|$element} element The element to bound to.
         * @param  {object} eventHandlers An object with handlers for specific touch events.
         * @param  {function} [eventHandlers.start]  The callback for `touchstart` event.
         * @param  {function} [eventHandlers.end]  The callback for `touchend` event.
         * @param  {function} [eventHandlers.move]  The callback for `touchmove` event.
         * @param  {function} [eventHandlers.cancel]  The callback for `touchcancel` event.
         * @param  {object} [options] Options.
         * @param  {integer} [options.movementThreshold] Amount of pixels of movement before start to trigger `touchmove` handlers.
         * @param  {function} [options.valid] Validity function. A `function(TouchInfo, event)⟶boolean` deciding if a touch should be handled or ignored.
         * @param  {function|Element|TextRectangle} [options.sensitiveArea] A
         * [Bounding Client Rect](https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect) or an element
         *  or a function that takes the bound element and returns one of the previous.
         *  Sensitive area define bounduaries to release touch when movement is outside.
         * @param  {array} [options.pointerTypes] Pointer types to handle. An array of pointer types that is intended to be
         *                                        a subset of keys from default pointer events map (see `$touchProvider.setPointerEvents`).
         *
         * @returns {function} The unbind function.
         *
         * @memberOf mobile-angular-ui.gestures.touch~$touch
         */
        bind: function($element, eventHandlers, options) {

          // ensure element to be an angular element
          $element = angular.element($element);

          options = options || {};
          // uses default pointer types in case of none passed
          var pointerTypes = options.pointerTypes || POINTER_TYPES;
          var isValid = options.valid === undefined ? VALID : options.valid;
          var movementThreshold = options.movementThreshold === undefined ? MOVEMENT_THRESHOLD : options.movementThreshold;
          var sensitiveArea = options.sensitiveArea === undefined ? SENSITIVE_AREA : options.sensitiveArea;

          // first and last touch
          var t0;
          var tl;

          // events
          var startEvents = getEvents(pointerTypes, 'start');
          var endEvents = getEvents(pointerTypes, 'end');
          var moveEvents = getEvents(pointerTypes, 'move');
          var cancelEvents = getEvents(pointerTypes, 'cancel');

          var startEventHandler = eventHandlers.start;
          var endEventHandler = eventHandlers.end;
          var moveEventHandler = eventHandlers.move;
          var cancelEventHandler = eventHandlers.cancel;

          var $movementTarget = angular.element($element[0].ownerDocument);
          var onTouchMove;
          var onTouchEnd;
          var onTouchCancel;

          var resetTouch = function() {
            t0 = tl = null;
            $movementTarget.off(moveEvents, onTouchMove);
            $movementTarget.off(endEvents, onTouchEnd);
            if (cancelEvents) {
              $movementTarget.off(cancelEvents, onTouchCancel);
            }
          };

          var isActive = function() {
            return Boolean(t0);
          };

          //
          // Callbacks
          //

          // on touchstart
          var onTouchStart = function(event) {
            // don't handle multi-touch
            if (event.touches && event.touches.length > 1) {
              return;
            }
            tl = t0 = buildTouchInfo('touchstart', getCoordinates(event));
            $movementTarget.on(moveEvents, onTouchMove);
            $movementTarget.on(endEvents, onTouchEnd);
            if (cancelEvents) {
              $movementTarget.on(cancelEvents, onTouchCancel);
            }
            if (startEventHandler) {
              startEventHandler(t0, event);
            }
          };

          // on touchCancel
          onTouchCancel = function(event) {
            var t = buildTouchInfo('touchcancel', getCoordinates(event), t0, tl);
            resetTouch();
            if (cancelEventHandler) {
              cancelEventHandler(t, event);
            }
          };

          // on touchMove
          onTouchMove = function(event) {
            // don't handle multi-touch
            if (event.touches && event.touches.length > 1) {
              return;
            }

            if (!isActive()) {
              return;
            }

            var coords = getCoordinates(event);

            //
            // wont fire outside sensitive area
            //
            var mva = typeof sensitiveArea === 'function' ? sensitiveArea($element) : sensitiveArea;
            mva = mva.length ? mva[0] : mva;

            var mvaRect = mva instanceof Element ? mva.getBoundingClientRect() : mva;

            if (coords.x < mvaRect.left || coords.x > mvaRect.right || coords.y < mvaRect.top || coords.y > mvaRect.bottom) {
              return;
            }

            var t = buildTouchInfo('touchmove', coords, t0, tl);
            var totalX = t.totalX;
            var totalY = t.totalY;

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
          onTouchEnd = function(event) {
            // don't handle multi-touch
            if (event.touches && event.touches.length > 1) {
              return;
            }

            if (!isActive()) {
              return;
            }

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
              if (cancelEvents) {
                $movementTarget.off(cancelEvents, onTouchCancel);
              }
              $movementTarget.off(moveEvents, onTouchMove);
              $movementTarget.off(endEvents, onTouchEnd);

              // Clear all those variables we carried out from `#bind` method scope
              // to local scope and that we don't have to use anymore
              $element = $movementTarget = startEvents = cancelEvents =
                moveEvents = endEvents = onTouchStart = onTouchCancel =
                onTouchMove = onTouchEnd = pointerTypes = isValid =
                movementThreshold = sensitiveArea = null;
            }
          };
        }
      };
    }];
  });
})();
