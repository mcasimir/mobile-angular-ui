# content-for / yield-to directives
# 

angular.module("mobile-angular-ui.directives.capture", [])

.run( [ "CaptureService", "$rootScope", (CaptureService, $rootScope) ->
  $rootScope.$on '$routeChangeStart', ->
    CaptureService.resetAll()
])

.factory("CaptureService", [ "$compile", ($compile) -> 
  yielders = {}

  resetAll: () ->
    for name, yielder of yielders
      @resetYielder(name)
  
  resetYielder: (name) ->
    b = yielders[name]
    @setContentFor(name, b.defaultContent, b.defaultScope)

  putYielder: (name, element, defaultScope, defaultContent) ->
    yielder = yielders[name] = {}
    yielder.name = name
    yielder.element = element
    yielder.defaultContent = defaultContent or ""
    yielder.defaultScope = defaultScope

  getYielder: (name) ->
    yielders[name]

  removeYielder: (name) ->
    delete yielders[name]

  setContentFor: (name, content, scope) ->
    b = yielders[name]
    return unless b
    sanitizedContent = content.replace(/^\s+/, "")
    compiled = $compile( sanitizedContent )(scope)
    b.element.empty().append(compiled)
])

.directive( "contentFor", [ "CaptureService", (CaptureService) -> 
  link: (scope, elem, attrs) ->
    CaptureService.setContentFor(attrs.contentFor, elem.html(), scope)
    if not attrs.duplicate?
      elem.remove()
    else
      elem
])

.directive( "yieldTo", [ 
  "$compile"
  "CaptureService"
  ($compile, CaptureService) ->
    link: (scope, element, attr) ->
      CaptureService.putYielder(attr.yieldTo, element, scope, element.html())
      element.contents().remove()

])