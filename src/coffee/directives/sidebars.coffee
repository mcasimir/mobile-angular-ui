angular.module('mobile-angular-ui.directives.sidebars', [])

.directive('sidebarLeft', ->
  replace: false
  restrict: "C"
  link: (scope, elem, attrs) ->
    elem.parent().addClass('has-sidebar-left')
  )

.directive('sidebarRight', ->
  replace: false
  restrict: "C"
  link: (scope, elem, attrs) ->
    elem.parent().addClass('has-sidebar-right')
  )
