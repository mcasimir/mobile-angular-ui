angular.module('mobile-angular-ui.directives.forms', [])

.directive( "bsInput", -> 
  return {
    replace: true
    require: "ngModel"
    template: (elems, attrs) -> 
      inputId = attrs.ngModel.replace(".", "_") + "_input"
      """
        <div class="form-group">
          <label for="#{inputId}" class="control-label col-sm-2">#{attrs.label}</label>
          <div class="col-sm-10">
            <input type="#{attrs.type}" 
                   id="#{inputId}"
                   ng-model="#{attrs.ngModel}" 
                   class="form-control #{attrs.class or ''}" />
          </div>
        </div>
      """

    link: (scope, element, attrs) ->
      element.removeAttr('type')
             .removeAttr('label')
             .removeAttr('ng-model')
             .attr('class', "form-group")
  }
)

.directive( "bsTextarea", -> 
  return {
    replace: true
    require: "ngModel"
    template: (elems, attrs) -> 
      inputId = attrs.ngModel.replace(".", "_") + "_input"
      """
        <div class="form-group">
          <label for="#{inputId}" class="control-label col-sm-2">#{attrs.label}</label>
          <div class="col-sm-10">
            <textarea id="#{inputId}" ng-model="#{attrs.ngModel}" class="form-control #{attrs.class or ''}"></textarea>
          </div>
        </div>
      """

    link: (scope, element, attrs) ->
      element.removeAttr('label')
             .removeAttr('ng-model')
             .attr('class', "form-group")
  }
)