(function() {
  'use strict';

  // An adaptation of ngTouch.$swipe
  // basically the same despite of:
  // 1) It does not require ngTouch thus is better compatible with fastclick.js 
  // 2) It allows to unbind
  angular.module('mobile-angular-ui.gestures.swipe', [])

  .factory('$swipe', [function() {
    var MOVE_BUFFER_RADIUS = 10;

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

    function getCoordinates(event) {
      var touches = event.touches && event.touches.length ? event.touches : [event];
      var e = (event.changedTouches && event.changedTouches[0]) ||
          (event.originalEvent && event.originalEvent.changedTouches &&
              event.originalEvent.changedTouches[0]) ||
          touches[0].originalEvent || touches[0];

      return {
        x: e.clientX,
        y: e.clientY
      };
    }

    function getEvents(pointerTypes, eventType) {
      var res = [];
      angular.forEach(pointerTypes, function(pointerType) {
        var eventName = POINTER_EVENTS[pointerType][eventType];
        if (eventName) {
          res.push(eventName);
        }
      });
      return res.join(' ');
    }

    return {
      bind: function(element, eventHandlers, pointerTypes) {
        // Absolute total movement, used to control swipe vs. scroll.
        var totalX, totalY;
        // Coordinates of the start position.
        var startCoords;
        // Last event's position.
        var lastPos;
        // Whether a swipe is active.
        var active = false;

        pointerTypes = pointerTypes || ['mouse', 'touch'];

        var cancelEvents = getEvents(pointerTypes, 'cancel');
        var startEvents = getEvents(pointerTypes, 'start');
        var endEvents = getEvents(pointerTypes, 'end');
        var moveEvents = getEvents(pointerTypes, 'move');

        var startCb = function(event) {
          startCoords = getCoordinates(event);
          active = true;
          totalX = 0;
          totalY = 0;
          lastPos = startCoords;
          if (eventHandlers.start) {
            eventHandlers.start(startCoords, event);
          }
        };

        var moveCb = function(event) {
          if (!active) return;

          // Android will send a touchcancel if it thinks we're starting to scroll.
          // So when the total distance (+ or - or both) exceeds 10px in either direction,
          // we either:
          // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
          // - On totalY > totalX, we let the browser handle it as a scroll.

          if (!startCoords) return;
          var coords = getCoordinates(event);

          totalX += Math.abs(coords.x - lastPos.x);
          totalY += Math.abs(coords.y - lastPos.y);

          lastPos = coords;

          if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
            return;
          }

          // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
          if (totalY > totalX) {
            // Allow native scrolling to take over.
            active = false;
            if (eventHandlers.cancel) {
              eventHandlers.cancel(event);
            }
            return;
          } else {
            // Prevent the browser from scrolling.
            event.preventDefault();
            if (eventHandlers.move) {
              eventHandlers.move(coords, event);
            }
          }
        };

        var cancelCb = function(event) {
          active = false;
          if (eventHandlers.cancel) {
            eventHandlers.cancel(event);
          }        
        };

        var endCb = function(event) {
          if (!active) return;
          active = false;
          if(eventHandlers.end) {
            eventHandlers.end(getCoordinates(event), event);
          }
        };

        element.on(startEvents, startCb);
        if (cancelEvents) { element.on(cancelEvents, cancelCb); }
        element.on(moveEvents, moveCb);
        element.on(endEvents, endCb);
      
        return function unbind() {
          element.off(startEvents, startCb);
          if (cancelEvents) { element.off(cancelEvents, cancelCb); }
          element.off(moveEvents, moveCb);
          element.off(endEvents, endCb);
          element = startEvents = startCb = moveEvents = moveCb = endEvents = endCb = cancelEvents = cancelCb = null;
        };
      }
    };
  }]);
}());
