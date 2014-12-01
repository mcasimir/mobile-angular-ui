(function() {
  'use strict';
  var module = angular.module('mobile-angular-ui.core.ui', ['mobile-angular-ui.core.sharedState']);

  module.factory('uiBindEvent', function(){
    return function(scope, element, eventNames, fn){
      eventNames = eventNames || 'click tap';
      element.on(eventNames, function(event){
        scope.$apply(function() {
          fn(scope, {$event:event});
        });
      });
    };
  });


  module.directive('uiState', [
    'SharedState', 
    '$parse',
    function(SharedState, $parse){
      return {
        restrict: 'EA',
        priority: 601, // more than ng-if
        link: function(scope, elem, attrs){
          var id               = attrs.uiState || attrs.id,
              defaultValueExpr = attrs.uiDefault || attrs['default'],
              defaultValue     = defaultValueExpr ? scope.$eval(defaultValueExpr) : undefined;

          SharedState.initialize(scope, id, {
            defaultValue: defaultValue,
            exclusionGroup: attrs.uiExclusionGroup
          });
        }
      };
    }
  ]);

  angular.forEach(['toggle', 'turnOn', 'turnOff', 'set'], 
    function(methodName){
      var directiveName = 'ui' + methodName[0].toUpperCase() + methodName.slice(1);
      
      module.directive(directiveName, [
        '$parse',
        'SharedState',
        'uiBindEvent',
        function($parse, SharedState, uiBindEvent) {
              var method = SharedState[methodName];
              return {
                restrict: 'A',
                compile: function(elem, attrs) {
                  var fn = methodName === 'set' ?
                    $parse(attrs[directiveName]) :
                      function(scope) {
                        return attrs[directiveName]; 
                      };

                  return function(scope, elem, attrs) {
                    var callback = function() {
                      var arg = fn(scope);
                      return method.call(SharedState, arg);
                    };
                    uiBindEvent(scope, elem, attrs.uiTriggers, callback);
                  };
                }
              };
            }
      ]);
    });

  // Same as ng-if but takes into account SharedState too
  module.directive('uiIf', ['$animate', 'SharedState', '$parse', function($animate, SharedState, $parse) {
    function getBlockNodes(nodes) {
      var node = nodes[0];
      var endNode = nodes[nodes.length - 1];
      var blockNodes = [node];
      do {
        node = node.nextSibling;
        if (!node) break;
        blockNodes.push(node);
      } while (node !== endNode);

      return angular.element(blockNodes);
    }

    return {
      multiElement: true,
      transclude: 'element',
      priority: 600,
      terminal: true,
      restrict: 'A',
      $$tlb: true,
      link: function ($scope, $element, $attr, ctrl, $transclude) {
          var block, childScope, previousElements, 
          exprFn = $parse($attr.uiIf),
          uiIfFn = function() { // can be slow
            return exprFn(angular.extend({}, SharedState.values(), $scope));
          };

          $scope.$watch(uiIfFn, function uiIfWatchAction(value) {
            if (value) {
              if (!childScope) {
                $transclude(function (clone, newScope) {
                  childScope = newScope;
                  clone[clone.length++] = document.createComment(' end uiIf: ' + $attr.uiIf + ' ');
                  // Note: We only need the first/last node of the cloned nodes.
                  // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                  // by a directive with templateUrl when its template arrives.
                  block = {
                    clone: clone
                  };
                  $animate.enter(clone, $element.parent(), $element);
                });
              }
            } else {
              if (previousElements) {
                previousElements.remove();
                previousElements = null;
              }
              if (childScope) {
                childScope.$destroy();
                childScope = null;
              }
              if (block) {
                previousElements = getBlockNodes(block.clone);
                var done = function() {
                  previousElements = null;
                };
                var nga = $animate.leave(previousElements, done);
                if (nga) {
                  nga.then(done);
                }
                block = null;
              }
            }
          });
      }
    };
  }]);

  // Same as ng-hide but takes into account SharedState too
  module.directive('uiHide', ['$animate', 'SharedState', '$parse', function($animate, SharedState, $parse) {
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

    return {
      restrict: 'A',
      multiElement: true,
      link: function(scope, element, attr) {
        var exprFn = $parse(attr.uiHide),
        uiHideFn = function() { // can be slow
          return exprFn(angular.extend({}, SharedState.values(), scope));
        };
        scope.$watch(uiHideFn, function uiHideWatchAction(value){
          $animate[value ? 'addClass' : 'removeClass'](element,NG_HIDE_CLASS, {
            tempClasses : NG_HIDE_IN_PROGRESS_CLASS
          });
        });
      }
    };
  }]);

  // Same as ng-show but takes into account SharedState too
  module.directive('uiShow', ['$animate', 'SharedState', '$parse', function($animate, SharedState, $parse) {
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';

    return {
      restrict: 'A',
      multiElement: true,
      link: function(scope, element, attr) {
        var exprFn = $parse(attr.uiShow),
        uiShowFn = function() { // can be slow
          return exprFn(angular.extend({}, SharedState.values(), scope));
        };
        scope.$watch(uiShowFn, function uiShowWatchAction(value){
          $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
            tempClasses : NG_HIDE_IN_PROGRESS_CLASS
          });
        });
      }
    };
  }]);

  // A simplified version of ngClass that evaluates in context of SharedState too, 
  // it only suppors the {'className': expr} syntax.
  module.directive('uiClass', ['SharedState', '$parse', function(SharedState, $parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        var exprFn = $parse(attr.uiClass),
        uiClassFn = function() { // can be slow
          return exprFn(angular.extend({}, SharedState.values(), scope));
        };
        scope.$watch(uiClassFn, function uiClassWatchAction(value){
          var classesToAdd = "";
          var classesToRemove = "";
          angular.forEach(value, function(expr, className) {
            if (expr) {
              classesToAdd += " " + className;
            } 
            else {
              classesToRemove += " " + className;
            }
            if (classesToAdd.length) {
              element.addClass(classesToAdd);  
            }
            if (classesToRemove.length) {
              element.removeClass(classesToRemove);
            }
          });
        }, true);
      }
    };
  }]);

  module.run([
    '$rootScope',
    'SharedState',
    function($rootScope, SharedState){
      $rootScope.Ui = SharedState;
    }
  ]);

}());