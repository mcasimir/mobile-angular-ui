overthrow.scrollIndicatorClassName = "scrollable"

angular.module("mobile-angular-ui", [
  'ngTouch'
  'ngAnimate'
  'mobile-angular-ui.directives.toggle'
  'mobile-angular-ui.directives.overlay'
  'mobile-angular-ui.directives.forms'
  'mobile-angular-ui.directives.panels'
  'mobile-angular-ui.directives.capture'
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