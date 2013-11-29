angular.module("maui.directives.contentFor", []).directive "contentFor", [
  "$sce"
  ($sce) ->
    return compile: (e, attrs, transclude) ->
      pre: (scope, iElement, iAttrs, controller) ->
        html = undefined
        targetScope = undefined
        varname = undefined
        varname = iAttrs["contentFor"]
        targetScope = scope
        while targetScope.$parent
          if (if targetScope.hasOwnProperty then targetScope.hasOwnProperty(varname) else targetScope[varname])
            break
          else
            targetScope = targetScope.$parent
        html = iElement.html()
        targetScope[varname] = $sce.trustAsHtml(html)
        iElement.remove()
]
