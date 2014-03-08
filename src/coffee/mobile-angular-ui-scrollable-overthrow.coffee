# Provides a scrollable implementation based on Overthrow
# Many thanks to pavei (https://github.com/pavei) to submit
# basic implementation

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

  .run( ["$window", ($window) -> 

      adjustScrollablesHeight()
      $window.onresize = adjustScrollablesHeight
    ])

  .directive "scrollableContent", ->
    replace: false
    restrict: "C"
    link: (scope, element, attr) ->
      adjustScrollableHeight(element.parent()[0])
      
      if(overthrow.support is "native") 
        element.attr("style", "overflow: auto; -webkit-overflow-scrolling: touch;")
      else
        element.addClass("overthrow")
        overthrow.forget()
        overthrow.set()

)()