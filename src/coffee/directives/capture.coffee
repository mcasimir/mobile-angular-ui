# content-for / yield-to directives
# 


angular.module("mobile-angular-ui.directives.capture", [])

.run [ ->
  # on route change reset yield to default
]

# .directive( "contentFor", [
#   "$sce"
#   ($sce) ->
#     return compile: (e, attrs, transclude) ->
#       pre: (scope, iElement, iAttrs, controller) ->
#         html = undefined
#         targetScope = undefined
#         varname = undefined
#         varname = iAttrs["contentFor"]
#         targetScope = scope
#         while targetScope.$parent
#           if (if targetScope.hasOwnProperty then targetScope.hasOwnProperty(varname) else targetScope[varname])
#             break
#           else
#             targetScope = targetScope.$parent
#         html = iElement.html()
#         targetScope[varname] = $sce.trustAsHtml(html)
#         iElement.remove()
# ])

# App.directive( "yieldTo", [
#   "$sce"
#   "$parse"
#   ($sce, $parse) ->
#     return (scope, element, attr) ->

#       getStringValue = ->
#         (parsed(scope) or "").toString()

#       parsed = $parse(attr.yieldTo)
#       scope.$watch getStringValue, yieldToWatchAction = (value) ->
#         html = $sce.getTrustedHtml(parsed(scope)) or ""
#         element.html html
#         # element.attr("yield-to", attr.yieldTo)
#         # element.addClass("ng-binding").data "$binding", attr.yieldTo

# ])