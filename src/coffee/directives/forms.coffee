angular.module('mobile-angular-ui.directives.forms', [])

.directive( "bsInput", -> 
  return {
    replace: true
    require: "ngModel"

    link: (scope, elem, attrs) ->      
      attrs.id ?= attrs.ngModel.replace(".", "_") + "_input"
      elem.addClass("form-control")
      ll = angular.element("""<label for="#{attrs.id}" class="control-label col-sm-2">#{attrs.label}</label>""")
      w1 = angular.element("""<div class="form-group container-fluid"></div>""")
      w2 = angular.element("""<div class="row"></div>""")
      w3 = angular.element("""<div class="col-sm-10"></div>""")
      elem.wrap(w1).wrap(w2).wrap(w3)
      w2.prepend(ll)
  }
)

.directive( "bsTextarea", -> 
  return {
    replace: true
    require: "ngModel"
    template: (elem, attrs) -> 
      inputId = attrs.ngModel.replace(".", "_") + "_input"
      """
        <div class="form-group container-fluid">
          <div class="row">
            <label for="#{inputId}" class="control-label col-sm-2">#{attrs.label}</label>
            <div class="col-sm-10">
              <textarea id="#{inputId}" ng-model="#{attrs.ngModel}" class="form-control #{attrs.class or ''}"></textarea>
            </div>
          </div>
        </div>
      """

    link: (scope, element, attrs) ->
      element.removeAttr('label')
             .removeAttr('ng-model')
             .attr('class', "form-group")
  }
)