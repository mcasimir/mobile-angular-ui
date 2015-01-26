/**
@module mobile-angular-ui.gestures.drag
@description

`mobile-angular-ui.gestures.drag` module exposes the `$drag` service that is used 
to handle drag gestures. `$drag` service wraps [$touch](../module:touch) service adding
CSS transforms reacting to `touchmove` events.

## Usage

``` js
angular.module('myApp', ['mobile-angular-ui.gestures']);
```

Or

``` js
angular.module('myApp', ['mobile-angular-ui.gestures.drag']);
```

``` js
var dragOptions = {
  transform: $drag.TRANSLATE_BOTH,
  start:  function(dragInfo, event){},
  end:    function(dragInfo, event){},
  move:   function(dragInfo, event){},
  cancel: function(dragInfo, event){}
};

$drag.bind(element, dragOptions, touchOptions);
```

Where:

- `transform` is a `function(element, currentTransform, touch) -> newTransform`
   returning taking an `element`, its `currentTransform` and returning the `newTransform` 
   for the element in response to `touch`. See [$transform](../module:transform) for more.
   Default to `$drag.TRANSLATE_BOTH`.
- `start`, `end`, `move`, `cancel` are optional callbacks responding to `drag` movement phases.
- `dragInfo` is an extended version of `touchInfo` from [$touch](../module:touch), 
  extending it with:
  - `originalTransform`: The [$transform](../module:transform) object relative to CSS transform before `$drag` is bound.
  - `originalRect`: The [Bounding Client Rect](https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect) for bound element before any drag action.
  - `startRect`: The [Bounding Client Rect](https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect) for bound element registered at `start` event.
  - `startTransform`: The [$transform](../module:transform) at `start` event.
  - `rect`: The current [Bounding Client Rect](https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect) for bound element.
  - `transform`: The current [$transform](../module:transform).
  - `reset`: A function restoring element to `originalTransform`.
  - `undo`: A function restoring element to `startTransform`.
- `touchOptions` is an option object to be passed to underlying [`$touch`](../module:touch) service.

### Predefined transforms

- `$drag.NULL_TRANSFORM`: No transform follow movement
- `$drag.TRANSLATE_BOTH`: Transform translate following movement on both x and y axis.
- `$drag.TRANSLATE_HORIZONTAL`: Transform translate following movement on x axis.
- `$drag.TRANSLATE_UP`: Transform translate following movement on negative y axis.
- `$drag.TRANSLATE_DOWN`: Transform translate following movement on positive y axis.
- `$drag.TRANSLATE_LEFT`: Transform translate following movement on negative x axis.
- `$drag.TRANSLATE_RIGHT`: Transform translate following movement on positive x axis.
- `$drag.TRANSLATE_VERTICAL`: Transform translate following movement on y axis.
- `$drag.TRANSLATE_INSIDE`: Is a function and should be used like:
   
   ``` js
    { 
      transform: $drag.TRANSLATE_INSIDE(myElement)
    }
   ```

   It returns a transform function that contains translate movement inside 
   the passed element. 

### `.ui-drag-move` style

While moving an `.ui-drag-move` class is attached to element. Style for this class is defined via
[insertRule](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet.insertRule) and aims to
fix common problems while dragging, specifically:

- Brings the element in front of other elements
- Disable transitions
- Makes text unselectable

**NOTE** Transitions are disabled cause they may introduce conflicts between `transition: transform` 
 and `dragOptions.transform` function.

They will be re-enabled after drag, and this can be used to achieve some graceful effects.

If you need transition that does not involve transforms during movement you can apply them to an
inner or wrapping element. 

### Examples

#### Limit movement to an element

``` js
app.directive('dragMe', ['$drag', function($drag){
  return {
    controller: function($scope, $element) {
      $drag.bind($element, 
        {
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);
```

<iframe class='embedded-example' src='/examples/drag.html'></iframe>
*/
(function () {
   'use strict';

   angular.module('mobile-angular-ui.gestures.drag', [
     'mobile-angular-ui.gestures.touch',
     'mobile-angular-ui.gestures.transform'
   ])

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

              // prevents outer swipes
              event.__UiSwipeHandled__ = true;
              
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