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
(function() {
  'use strict';      

  var module = angular.module('mobile-angular-ui.migrate.panels', []);

  // 
  // Old panel helpers
  //
  module.directive("bsPanel", function() {
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

}());
(function() {
  'use strict';      

  var module = angular.module('mobile-angular-ui.migrate.toggle', ['mobile-angular-ui.core.sharedState']);

  // Note!
  // This is an adaptation of 1.1 toggle/toggleable interface for SharedState service,
  // although this should fit the most common uses it is not 100% backward compatible.
  // 
  // Differences are:
  // - toggleByClass behaviour is not supported
  // - toggleByClass/togglerLinked/toggle events are not supported
  // 
  module.directive('toggle', ['SharedState',function(SharedState) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var exclusionGroup        =  attrs.exclusionGroup,
            command               =  attrs.toggle || 'toggle',
            bubble                =  scope.$eval(attrs.bubble),
            activeClass           =  attrs.activeClass,
            inactiveClass         =  attrs.inactiveClass,
            parentActiveClass     =  attrs.parentActiveClass,
            parentInactiveClass   =  attrs.parentInactiveClass,
            parent                =  elem.parent(),
            id                    =  attrs.target;

        if ((!id) && attrs.href) {
          id = attrs.href.slice(1);
        }

        if (!id) {
          throw new Error('Toggle directive requires "target" attribute to be set. If you are using toggleByClass yet be aware that is not supported by migration version of toggle.\nPlease switch to ui-* directives instead.');
        }

        var setupClasses = function(value) {
          if (value) {
            if (parentActiveClass) { parent.addClass(parentActiveClass); }
            if (activeClass) { elem.addClass(activeClass); }
            if (parentInactiveClass) { parent.removeClass(parentInactiveClass); }
            if (inactiveClass) { elem.removeClass(inactiveClass); }            
          } else {
            if (parentActiveClass) { parent.removeClass(parentActiveClass); }
            if (activeClass) { elem.removeClass(activeClass); }
            if (parentInactiveClass) { parent.addClass(parentInactiveClass); }
            if (inactiveClass) { elem.addClass(inactiveClass); }
          }
        };

        scope.$on('mobile-angular-ui.state.changed.' + id, function(evt, value) {
          setupClasses(value);
        });

        setupClasses(SharedState.get('id'));

        elem.on("click tap", function(e) {
          if (!scope.$$phase) {
            scope.$apply(function() {
              if (command === 'on') {
                SharedState.turnOn(id);
              } else if (command === 'off') {
                SharedState.turnOff(id);
              } else {
                SharedState.toggle(id);
              }
            });
          }

          if (!bubble) {
            e.preventDefault();
            return false;
          } else {
            return true;
          }
        });        
      }
    };
  }]);

  module.directive('toggleable', ['SharedState', '$rootScope', function(SharedState, $rootScope) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {

        var exclusionGroup        =  attrs.exclusionGroup,
            defaultValue          =  attrs.default === 'active',
            activeClass           =  attrs.activeClass,
            inactiveClass         =  attrs.inactiveClass,
            parentActiveClass     =  attrs.parentActiveClass,
            parentInactiveClass   =  attrs.parentInactiveClass,
            parent                =  elem.parent(),
            id                    =  attrs.toggleable || attrs.id;

        scope.$on('mobile-angular-ui.state.changed.' + id, function(evt, value) {

          if (value) {
            if (parentActiveClass) { parent.addClass(parentActiveClass); }
            if (activeClass) { elem.addClass(activeClass); }
            if (parentInactiveClass) { parent.removeClass(parentInactiveClass); }
            if (inactiveClass) { elem.removeClass(inactiveClass); }            
          } else {
            if (parentActiveClass) { parent.removeClass(parentActiveClass); }
            if (activeClass) { elem.removeClass(activeClass); }
            if (parentInactiveClass) { parent.addClass(parentInactiveClass); }
            if (inactiveClass) { elem.addClass(inactiveClass); }
          }

          $rootScope.$emit('mobile-angular-ui.toggle.toggled', id, value, exclusionGroup);
        });


        SharedState.initialize(scope, id, {defaultValue: defaultValue, exclusionGroup: exclusionGroup});
      }
    };    
  }]);
}());
(function() {
  'use strict';      

  var module = angular.module('mobile-angular-ui.migrate', 
    [
      'mobile-angular-ui.migrate.toggle',
      'mobile-angular-ui.migrate.forms',
      'mobile-angular-ui.migrate.panels'
    ]);
}());