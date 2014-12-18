(function() {
  'use strict';      

  var module = angular.module('mobile-angular-ui.migrate.namespaceAliases', []);

  var uncamelize = function(text) {
    var separator = "-";

    text = text.replace(/[A-Z]/g, function (letter) {
      return separator + letter.toLowerCase();
    });
   
    return text.replace("/^" + separator + "/", '');   
  };

  var aliasDirective = function(aliasName, targetDirective, options) {
    options = options || {};
    var beforeLink = options.beforeLink;
    var restrict = options.restrict || 'A';
    module.directive(aliasName, ['$compile', function($compile){
      return {
          restrict: restrict,

          // this should be higher than any other directives
          // declared for the same element
          priority: 99999,
          compile: function(elem, attrs){
            
            var placeholder = angular.element(document.createElement('div'));
            elem.after(placeholder);
            // Detach element until link phase 
            // so Angular wont go down to the children.
            elem.remove();

            var dasherizedTarget = uncamelize(targetDirective);
            var dasherizedAlias = uncamelize(aliasName);

            if (restrict.match(/A/)) {
              // Replace old attr with new attr
              elem.attr(dasherizedTarget, elem.attr(dasherizedAlias));
              elem.removeAttr(dasherizedAlias);
            }

            if (restrict.match(/E/)) {
              elem[0].name = dasherizedTarget;
            }
            
            if (beforeLink) {
              beforeLink(elem, attrs);
            }
            
            return function(scope){
              placeholder.replaceWith(elem);
              $compile(elem)(scope);
              elem = null;
            };
          }
      };
    }]);
  };

  aliasDirective('switch', 'uiSwitch');
  aliasDirective('contentFor', 'uiContentFor', {
    beforeLink: function(elem) {
      elem.attr('uiDuplicate', elem.attr('duplicate'));
    }
  });
  aliasDirective('yieldTo', 'uiYieldTo');
}());