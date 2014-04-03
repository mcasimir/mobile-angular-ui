(->
  adjustScrollableHeight = (e) ->
    p = e.offsetParent
    paddingAndBordersHeight = e.offsetHeight - e.clientHeight

    if e.offsetTop + e.offsetHeight > p.clientHeight
      rightHeight = p.clientHeight - paddingAndBordersHeight - e.offsetTop

      if rightHeight > 0
        e.setAttribute("style","max-height:#{rightHeight}px");
    else
      e.setAttribute("style","max-height:99999px");

  adjustScrollablesHeight = ->
    scrollables = document.getElementsByClassName("scrollable")
    angular.forEach scrollables, (e) ->
      adjustScrollableHeight(e)

  angular.module("mobile-angular-ui.scrollable", [])

  .run(['$document', ($document) -> 

    $document[0].addEventListener "touchmove", ((e) ->
      e.preventDefault()
    ), false

  ])

  .run( ["$window", ($window) -> 
    $window.onresize = adjustScrollablesHeight
  ])

  .directive "scrollableContent", ->
    replace: false
    restrict: "C"
    link: (scope, element, attr) ->
    adjustScrollableHeight(element.parent()[0])
    setTimeout (->
      [].slice.call(document.querySelectorAll("input, select, button, textarea")).forEach (el) ->
        el.addEventListener (if ("ontouchstart" of window) then "touchstart" else "mousedown"), (e) ->
          e.stopPropagation()
 
      iscroll = new IScroll(element[0], {scrollbars: true, mouseWheel:true, checkDOMChanges: true})
    ), 200
)()
