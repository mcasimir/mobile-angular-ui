angular.module('mobile-angular-ui.directives.overlay', [])

.directive('overlay', [ "$compile", ($compile)->

  link: (scope, elem, attrs) ->
    body = elem.html()
    id = attrs.overlay
    html = """
      <div class="overlay" id="#{id}" toggleable active-class="in">
        <div class="overlay-inner">
          <div class="overlay-background"></div>
          <a href="##{id}" toggle="off" class="overlay-dismiss">
            <i class="fa fa-times-circle-o"></i>
          </a>
          <div class="overlay-content">
            <div class="overlay-body">
              #{body}
            </div>
          </div>
        </div>
      </div>
    """

    angular.element(document.body)
      .prepend($compile( html )( scope )) # moves elem where it overlays everithing
    elem.remove()

])
