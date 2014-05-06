angular.module('mobile-angular-ui.directives.overlay', []).directive('overlay', [
  "$compile", function($compile) {
    return {
      link: function(scope, elem, attrs) {
        var active = "";
        var body = elem.html();
        var id = attrs.overlay;

        if (attrs["default"] != null) {
          var active = "default='" + attrs["default"] + "'";
        }

        var html = "<div class=\"overlay\" id=\"" + id + "\" toggleable " + active + " parent-active-class=\"overlay-in\" active-class=\"overlay-show\">\n  <div class=\"overlay-inner\">\n    <div class=\"overlay-background\"></div>\n    <a href=\"#" + id + "\" toggle=\"off\" class=\"overlay-dismiss\">\n      <i class=\"fa fa-times-circle-o\"></i>\n    </a>\n    <div class=\"overlay-content\">\n      <div class=\"overlay-body\">\n        " + body + "\n      </div>\n    </div>\n  </div>\n</div>";
        elem.remove();

        var sameId = angular.element(document.getElementById(id));

        if (sameId.length > 0 && sameId.hasClass('overlay')) {
          sameId.remove();
        }

        body = angular.element(document.body);
        body.prepend($compile(html)(scope));

        if (attrs["default"] === "active") {
           body.addClass('overlay-in');
        }
      }
    };
  }
]);
