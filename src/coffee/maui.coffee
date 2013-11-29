angular.module("maui", [
  'ngTouch'
  'ngAnimate' 
  'ui.bootstrap.accordion'
  'ui.bootstrap.collapse'
  'ui.bootstrap.dropdownToggle'
  'maui.directives.activeLink'
  'maui.directives.contentFor'
  'maui.directives.sidebar'
  'maui.directives.tabs'
 ])

#
# Highlights active links
# 
.run(["$rootScope", ($rootScope) ->
  $rootScope.$on "$locationChangeSuccess", (e, newPath, oldPath) ->
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