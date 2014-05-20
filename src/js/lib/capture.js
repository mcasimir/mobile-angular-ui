angular.module("mobile-angular-ui.directives.capture", [])

.run([
  "CaptureService", "$rootScope", function(CaptureService, $rootScope) {
    $rootScope.$on('$routeChangeStart', function() {
      CaptureService.resetAll();
    });
  }
])

.factory("CaptureService", [
  "$compile", function($compile) {
    var yielders = {};

    return {
      resetAll: function() {
        for (name in yielders) {
          this.resetYielder(name);
        }
      },
      
      resetYielder: function(name) {
        var b = yielders[name];
        this.setContentFor(name, b.defaultContent, b.defaultScope);
      },

      putYielder: function(name, element, defaultScope, defaultContent) {
        var yielder = {};
        yielder.name = name;
        yielder.element = element;
        yielder.defaultContent = defaultContent || "";
        yielder.defaultScope = defaultScope;
        yielders[name] = yielder;
      },

      getYielder: function(name) {
        return yielders[name];
      },

      removeYielder: function(name) {
        delete yielders[name];
      },
      
      setContentFor: function(name, content, scope) {
        var b = yielders[name];
        if (!b) {
          return;
        }
        b.element.html(content);
        $compile(b.element.contents())(scope);
      }

    };
  }
])

.directive("contentFor", [
  "CaptureService", function(CaptureService) {
    return {
      compile: function(tElem, tAttrs) {
        var rawContent = tElem.html();
        if(tAttrs.duplicate == null) {
          // no need to compile anything!
          tElem.html("");
        }
        return function postLink(scope, elem, attrs) {
          CaptureService.setContentFor(attrs.contentFor, rawContent, scope);
          if (attrs.duplicate == null) {
            elem.remove();
          }
        }
      }
    };
  }
])

.directive("yieldTo", [
  "$compile", "CaptureService", function($compile, CaptureService) {
    return {
      link: function(scope, element, attr) {
        CaptureService.putYielder(attr.yieldTo, element, scope, element.html());
        element.contents().remove();

        scope.$on('$destroy', function(){
          CaptureService.removeYielder(attr.yieldTo);
        });
      }
    };
  }
]);
