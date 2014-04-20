angular.module('mobile-angular-ui.directives.forms', [])

.directive( "bsInput", -> 
  return {
    replace: true
    require: "ngModel"

    link: (scope, elem, attrs) ->      
      attrs.id ?= attrs.ngModel.replace(".", "_") + "_input"
      unless attrs.type in ["checkbox", "radio"]
        elem.addClass("form-control")

      ll = angular.element("""<label for="#{attrs.id}" class="control-label col-sm-2">#{attrs.label}</label>""")
      w1 = angular.element("""<div class="form-group container-fluid"></div>""")
      w2 = angular.element("""<div class="row"></div>""")
      w3 = angular.element("""<div class="col-sm-10"></div>""")
      elem.wrap(w1).wrap(w2).wrap(w3)
      w2.prepend(ll)
  }
)

.directive "switch", ->
  restrict: "EA"
  replace: true
  scope:
    model: "=ngModel"
    disabled: "@"

  template: """
    <div class="switch" ng-click="toggle()" ng-class="{ 'active': model }">
        <div class="switch-handle"></div>
    </div>
  """

  link: (scope, elem, attrs) ->
    scope.toggle = toggle = ->
      unless attrs.disabled?
        scope.model = not scope.model

    setTimeout (-> 
      elem.addClass('switch-transition-enabled')
      ), 200 
