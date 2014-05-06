angular.module('mobile-angular-ui.directives.forms', [])

.directive("bsFormControl", function() {
  return {
    replace: true,
    require: "ngModel",
    link: function(scope, elem, attrs) {
      if (attrs.id == null) {
        attrs.id = attrs.ngModel.replace(".", "_") + "_input";
      }
      if ((elem[0].tagName == "INPUT" || elem[0].tagName == "TEXTAREA") && (attrs.type != "checkbox" && attrs.type != "radio")) {
        elem.addClass("form-control");
      }
      var ll = angular.element("<label for=\"" + attrs.id + "\" class=\"control-label col-sm-2\">" + attrs.label + "</label>");
      var w1 = angular.element("<div class=\"form-group container-fluid\"></div>");
      var w2 = angular.element("<div class=\"row\"></div>");
      var w3 = angular.element("<div class=\"col-sm-10\"></div>");
      elem.wrap(w1).wrap(w2).wrap(w3);
      elem.parent().parent().prepend(ll);
      elem.attr('id', attrs.id);
      ll = w1 = w2 = w3 = null;
    }
  };
})

.directive("switch", function() {
  return {
    restrict: "EA",
    replace: true,
    scope: {
      model: "=ngModel",
      disabled: "@"
    },
    template: "<div class=\"switch\" ng-click=\"toggleSwitch()\" ng-class=\"{ 'active': model }\">\n    <div class=\"switch-handle\"></div>\n</div>",
    link: function(scope, elem, attrs) {
      scope.toggleSwitch = function() {
        if (attrs.disabled == null) {
          scope.model = !scope.model;
        }
      };
      setTimeout((function() {
        elem.addClass('switch-transition-enabled');
        elem = null;
      }), 200);
    }
  };
});
