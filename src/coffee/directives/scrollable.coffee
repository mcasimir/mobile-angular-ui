angular.module("mobile-angular-ui.directives.scrollable", [])
.directive "scrollable", ->
  replace: false
  restrict: "C"
  link: (scope, element, attr) ->
    setTimeout (->
      iscroll = new iScroll(element[0], wheelAction: 'scroll')
    ), 200
    
