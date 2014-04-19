angular.module("mobile-angular-ui.directives.panels", [])
.directive "bsPanel", ->
  
  return {
    restrict: 'EA'
    replace: true
    scope: false
    transclude: true
    link: (scope, elem, attrs) ->
      elem.removeAttr('title')

    template: (elems, attrs) -> 
      heading = ""
      
      if attrs.title
        heading = """
          <div class="panel-heading">
            <h2 class="panel-title">
              #{attrs.title}
            </h2>
          </div>
        """

      """
        <div class="panel">
          #{heading}
          <div class="panel-body">
             <div ng-transclude></div>
          </div>
        </div>
      """

  }