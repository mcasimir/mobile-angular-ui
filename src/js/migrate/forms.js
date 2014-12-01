(function() {
  'use strict';      

  var module = angular.module('mobile-angular-ui.migrate.forms', []);

  // 
  // Old form helpers
  // 
  module.directive("bsFormControl", function() {
    var bs_col_classes = {};
    var bs_col_sizes = ['xs', 'sm', 'md', 'lg'];
    
    for (var i = 0; i < bs_col_sizes.length; i++) {
      for (var j = 1; j <= 12; j++) {
        bs_col_classes['col-' + bs_col_sizes[i] + "-" + j] = true;
      }
    }
    
    function separeBsColClasses(clss) {
      var intersection = "";
      var difference = "";

      for (var i = 0; i < clss.length; i++) {
          var v = clss[i];
          if (v in bs_col_classes) { 
            intersection += (v + " "); 
          } else {
            difference += (v + " ");
          }
      }

      return {i: intersection.trim(), d: difference.trim()};
    }

    return {
      replace: true,
      require: "ngModel",
      link: function(scope, elem, attrs) {

        if (attrs.labelClass === null || attrs.labelClass === undefined) {
          attrs.labelClass = "";
        }

        if (attrs.id === null || attrs.id === undefined) {
          attrs.id = attrs.ngModel.replace(".", "_") + "_input";
        }
        
        if ((elem[0].tagName == "SELECT") || ((elem[0].tagName == "INPUT" || elem[0].tagName == "TEXTAREA") && (attrs.type != "checkbox" && attrs.type != "radio"))) {
          elem.addClass("form-control");
        }
        
        var label = angular.element("<label for=\"" + attrs.id + "\" class=\"control-label\">" + attrs.label + "</label>");
        var w1 = angular.element("<div class=\"form-group row\"></div>"); 
        var w2 = angular.element("<div class=\"form-control-wrapper\"></div>");
        
        var labelColClasses = separeBsColClasses(attrs.labelClass.split(/\s+/));
        if (labelColClasses.i === "") {
          label.addClass("col-xs-12");
        }
        label.addClass(attrs.labelClass);

        var elemColClasses = separeBsColClasses(elem[0].className.split(/\s+/));
        elem.removeClass(elemColClasses.i);
        w2.addClass(elemColClasses.i);
        if (elemColClasses.i === "") {
          w2.addClass("col-xs-12");
        }
        elem.wrap(w1).wrap(w2);
        elem.parent().parent().prepend(label);
        elem.attr('id', attrs.id);

        label = w1 = w2 = labelColClasses = elemColClasses = null;
      }
    };
  });

}());