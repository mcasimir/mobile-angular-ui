angular.module('mobile-angular-ui.directives.navbars', [])

.directive('navbarAbsoluteTop', ->
  replace: false
  restrict: "C"
  link: (scope, elem, attrs) ->
    elem.parent().addClass('has-navbar-top')
  )

.directive('navbarAbsoluteBottom', ->
  replace: false
  restrict: "C"
  link: (scope, elem, attrs) ->
    elem.parent().addClass('has-navbar-bottom')
  )