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
        var command               =  attrs.toggle || 'toggle';
        var bubble                =  attrs.bubble !== undefined && attrs.bubble !== 'false';
        var activeClass           =  attrs.activeClass;
        var inactiveClass         =  attrs.inactiveClass;
        var parentActiveClass     =  attrs.parentActiveClass;
        var parentInactiveClass   =  attrs.parentInactiveClass;
        var parent                =  elem.parent();
        var id                    =  attrs.target;

        if ((!id) && attrs.href) {
          id = attrs.href.slice(1);
        }

        if (!id) {
          throw new Error(
            'Toggle directive requires "target" attribute to be set. ' +
            'If you are using toggleByClass yet be aware that is not supported by ' +
            'migration version of toggle. Please switch to ui-* directives instead.'
          );
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

        elem.on('click tap', function(e) {
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

        var exclusionGroup        =  attrs.exclusionGroup;
        var defaultValue          =  attrs.default === 'active';
        var activeClass           =  attrs.activeClass;
        var inactiveClass         =  attrs.inactiveClass;
        var parentActiveClass     =  attrs.parentActiveClass;
        var parentInactiveClass   =  attrs.parentInactiveClass;
        var parent                =  elem.parent();
        var id                    =  attrs.toggleable || attrs.id;

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

  module.run(['$rootScope', 'SharedState', function($rootScope, SharedState) {

    $rootScope.toggle = function(target, command) {
      if (command === 'on') {
        SharedState.turnOn(target);
      } else if (command === 'off') {
        SharedState.turnOff(target);
      } else {
        SharedState.toggle(target);
      }
    };

    // $rootScope.toggleByClass = function(target, command) {
    //  // Not supported
    // };

  }]);
}());
