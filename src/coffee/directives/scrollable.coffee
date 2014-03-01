angular.module("mobile-angular-ui.directives.scrollable", [])
.directive "scrollable", ->
  replace: false
  restrict: "C"
  link: (scope, element, attr) ->
    setTimeout (->
      [].slice.call(document.querySelectorAll("input, select, button, textarea")).forEach (el) ->
        el.addEventListener (if ("ontouchstart" of window) then "touchstart" else "mousedown"), (e) ->
          e.stopPropagation()

      iscroll = new IScroll(element[0], {scrollbars: true, wheelAction: 'scroll', checkDOMChanges: true})
    ), 200
