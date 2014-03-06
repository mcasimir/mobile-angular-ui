#
# Provides touch events via fastclick.js
# $swipe service and related directives are 
# taken from angular-touch 1.2.1
#

angular.module('mobile-angular-ui.touch', [])

.run(['$window', '$document', ($window, $document) -> 

  $window.addEventListener "load", (->
    FastClick.attach $document[0].body
  ), false

])

.factory "$swipe", [->
  getCoordinates = (event) ->
    touches = (if event.touches and event.touches.length then event.touches else [event])
    e = (event.changedTouches and event.changedTouches[0]) or (event.originalEvent and event.originalEvent.changedTouches and event.originalEvent.changedTouches[0]) or touches[0].originalEvent or touches[0]
    x: e.clientX
    y: e.clientY
  MOVE_BUFFER_RADIUS = 10
  bind: (element, eventHandlers) ->
    totalX = undefined
    totalY = undefined
    startCoords = undefined
    lastPos = undefined
    active = false
    element.on "touchstart mousedown", (event) ->
      startCoords = getCoordinates(event)
      active = true
      totalX = 0
      totalY = 0
      lastPos = startCoords
      eventHandlers["start"] and eventHandlers["start"](startCoords, event)
      return

    element.on "touchcancel", (event) ->
      active = false
      eventHandlers["cancel"] and eventHandlers["cancel"](event)
      return

    element.on "touchmove mousemove", (event) ->
      return  unless active
      return  unless startCoords
      coords = getCoordinates(event)
      totalX += Math.abs(coords.x - lastPos.x)
      totalY += Math.abs(coords.y - lastPos.y)
      lastPos = coords
      return  if totalX < MOVE_BUFFER_RADIUS and totalY < MOVE_BUFFER_RADIUS
      if totalY > totalX
        active = false
        eventHandlers["cancel"] and eventHandlers["cancel"](event)
        return
      else
        event.preventDefault()
        eventHandlers["move"] and eventHandlers["move"](coords, event)
      return

    element.on "touchend mouseup", (event) ->
      return  unless active
      active = false
      eventHandlers["end"] and eventHandlers["end"](getCoordinates(event), event)
      return

    return
]


angular.forEach([
  {
    directiveName: "ngSwipeLeft"
    direction: -1
    eventName: "swipeleft"
  }
  {
    directiveName: "ngSwipeRight"
    direction: 1
    eventName: "swiperight"
  }], 

  (options) ->
    directiveName = options.directiveName
    direction = options.direction
    eventName = options.eventName

    angular.module('mobile-angular-ui.touch').directive directiveName, [
      "$parse"
      "$swipe"
      ($parse, $swipe) ->
        
        # The maximum vertical delta for a swipe should be less than 75px.
        MAX_VERTICAL_DISTANCE = 75
        
        # Vertical distance should not be more than a fraction of the horizontal distance.
        MAX_VERTICAL_RATIO = 0.3
        
        # At least a 30px lateral motion is necessary for a swipe.
        MIN_HORIZONTAL_DISTANCE = 30
        return (scope, element, attr) ->
          validSwipe = (coords) ->
            
            # Check that it's within the coordinates.
            # Absolute vertical distance must be within tolerances.
            # Horizontal distance, we take the current X - the starting X.
            # This is negative for leftward swipes and positive for rightward swipes.
            # After multiplying by the direction (-1 for left, +1 for right), legal swipes
            # (ie. same direction as the directive wants) will have a positive delta and
            # illegal ones a negative delta.
            # Therefore this delta must be positive, and larger than the minimum.
            return false  unless startCoords
            deltaY = Math.abs(coords.y - startCoords.y)
            deltaX = (coords.x - startCoords.x) * direction
            # Short circuit for already-invalidated swipes.
            valid and deltaY < MAX_VERTICAL_DISTANCE and deltaX > 0 and deltaX > MIN_HORIZONTAL_DISTANCE and deltaY / deltaX < MAX_VERTICAL_RATIO
          swipeHandler = $parse(attr[directiveName])
          startCoords = undefined
          valid = undefined
          $swipe.bind element,
            start: (coords, event) ->
              startCoords = coords
              valid = true
              return

            cancel: (event) ->
              valid = false
              return

            end: (coords, event) ->
              if validSwipe(coords)
                scope.$apply ->
                  element.triggerHandler eventName
                  swipeHandler scope,
                    $event: event

                  return

              return

          return
    ]
    return
  )
