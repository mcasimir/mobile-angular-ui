window.addEventListener "load", (->
  FastClick.attach document.body
), false

document.addEventListener "touchmove", ((e) ->
  e.preventDefault()
), false


angular.module("mobile-angular-ui", [
  'ngRoute'
  'mobile-angular-ui.directives.toggle'
  'mobile-angular-ui.directives.overlay'
  'mobile-angular-ui.directives.forms'
  'mobile-angular-ui.directives.panels'
  'mobile-angular-ui.directives.capture'
  'mobile-angular-ui.directives.scrollable'
 ])

#
# Highlights active links
# 

.run(["$rootScope", ($rootScope) ->
  angular.forEach ["$locationChangeSuccess", "$includeContentLoaded"], (evtName) ->

    $rootScope.$on evtName, ->
      newPath = window.location.href
      angular.forEach document.links, (domLink) ->
        link = angular.element(domLink)
        if domLink.href is newPath
          link.addClass("active")
        else
          link.removeClass("active")
])

# 
# Prevents click/tap actions on disabled elements
# Polyfills for pointer-events: none
# 
angular.element(document).on "click tap", (e) ->
  target = angular.element(e.target)
  if target.hasClass("disabled")
    e.preventDefault()
    e.stopPropagation()
    return false
  else
    return true