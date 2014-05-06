angular.module("mobile-angular-ui.directives.panels", [])

.directive("bsPanel", function() {
  return {
    restrict: 'EA',
    replace: true,
    scope: false,
    transclude: true,
    link: function(scope, elem, attrs) {
      elem.removeAttr('title');
    },
    template: function(elems, attrs) {
      var heading = "";
      if (attrs.title) {
        heading = "<div class=\"panel-heading\">\n  <h2 class=\"panel-title\">\n    " + attrs.title + "\n  </h2>\n</div>";
      }
      return "<div class=\"panel\">\n  " + heading + "\n  <div class=\"panel-body\">\n     <div ng-transclude></div>\n  </div>\n</div>";
    }
  };
});