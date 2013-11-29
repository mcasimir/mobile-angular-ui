angular.module("maui.directives.activeLink", []).directive "activeLink", [
  "$location"
  (location) ->
    return (
      restrict: "A"
      link: (scope, element, attrs, controller) ->
        clazz = attrs.activeLink
        path = attrs.href
        path = path.substring(1) #hack because path does bot return including hashbang
        scope.location = location
        scope.$watch "location.path()", (newPath) ->
          if path is newPath
            element.addClass clazz
          else
            element.removeClass clazz

    )
]
