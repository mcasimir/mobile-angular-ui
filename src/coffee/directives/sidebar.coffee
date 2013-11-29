# <div sidebar='left' class="sidebar sidebar-left">
# 
# </div>
#
# <div class='app'>
#   <a href ng-click='toggleSidebar("left")'>Toggle Left Sidebar</a>
#   <a href ng-click='toggleSidebar("right")'>Toggle Right Sidebar</a>
# </div>
#
# <div sidebar='right' class="sidebar sidebar-right">
# 
# </div>

angular.module("maui.directives.sidebar", []).directive "sidebar", [->
  restrict: "A"
  scope: {}
  link: (scope, elem, attrs) ->

    # 
    # Creates Sidebars on Root Object
    # 
    scope.$root.sidebars ?= {}
    scope.$root.sidebars[attrs.sidebar] ?= {
      visible: false
    }

    elem.addClass("sidebar")

    scope.$on "sidebar.toggle", (e, name, status)->
      if name is attrs.sidebar
        if status 
          elem.addClass("in")
        else
          elem.removeClass("in")

  controller: [ "$rootScope", "$scope", ($rootScope, $scope) ->

    $rootScope.sidebars ?= {}
    
    $rootScope.showSidebar = (name) ->
      $rootScope.sidebars[name] ?= {}
      $rootScope.sidebars[name].visible = true
      $rootScope.$broadcast("sidebar.toggle", name, $rootScope.sidebars[name].visible)

    $rootScope.hideSidebar = (name) ->
      $rootScope.sidebars[name] ?= {}
      $rootScope.sidebars[name].visible = false
      $rootScope.$broadcast("sidebar.toggle", name, $rootScope.sidebars[name].visible)

    $rootScope.toggleSidebar = (name) ->
      $rootScope.hideSidebars(except: [name])
      $rootScope.sidebars[name] ?= {}
      $rootScope.sidebars[name].visible = not $rootScope.sidebars[name].visible
      $rootScope.$broadcast("sidebar.toggle", name, $rootScope.sidebars[name].visible)

    $rootScope.hideSidebars = (options = {}) ->
      for name, sidebar of $rootScope.sidebars
        if ( not options.except ) or ( not name in options.except )
          sidebar.visible = false
          $rootScope.$broadcast("sidebar.toggle", name, sidebar.visible)

    $rootScope.$on "$routeChangeSuccess", ->
      $rootScope.hideSidebars()
  ]
]