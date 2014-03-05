#
# Highlights active links
# 

angular.module("mobile-angular-ui.active-links", [])

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
