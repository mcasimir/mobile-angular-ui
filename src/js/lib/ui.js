var module = angular.module('mobileAngularUi.ui', []);

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


module.directive('uiState', function(SharedState, $parse){
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs){
      var id               = attrs.uiState || attrs.id,
          defaultValueExpr = attrs.uiDefault || attrs['default'],
          defaultValue     = defaultValueExpr ? scope.$eval(defaultValueExpr) : undefined;

      SharedState.initialize(scope, id);

      if (defaultValue !== undefined) {
        scope.$evalAsync(function(){
          SharedState.set(id, defaultValue);
        });
      }
    }
  };
});

angular.forEach(['toggle', 'turnOn', 'turnOff', 'set'], 
  function(methodName){
    var directiveName = 'ui' + methodName[0].toUpperCase() + methodName.slice(1);
    
    module.directive(directiveName, function($parse, SharedState, uiBindEvent) {
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
    });
  });

module.run(function($rootScope, SharedState){
  $rootScope.ui = SharedState;
});