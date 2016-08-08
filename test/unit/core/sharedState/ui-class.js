'use strict';

describe('core', function() {
  describe('sharedState', function() {
    var scope;
    var compile;
    var SharedState;

    beforeEach(function() {
      module('mobile-angular-ui.core.sharedState');
      inject(function($rootScope, $compile, _SharedState_) {
        scope = $rootScope.$new();
        compile = $compile;
        SharedState = _SharedState_;
      });
    });

    describe('ui-class', function() {
      it('should set defined class if state is true', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: true});

        var elem = angular.element('<div ui-class="{ \'active\': state1 }" />');
        var directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should not set defined class if state is false', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        var elem = angular.element('<div ui-class="{ \'active\': state1 }" />');
        var directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).not.toContain('active');
      });

      it('should set defined class if interpolated state is true', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: true});
        scope.x = 1;

        var elem = angular.element('<div ui-class="{ \'active\': state{{x}} }" />');
        var directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should not set defined class if interpolated state is false', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});
        scope.x = 1;

        var elem = angular.element('<div ui-class="{ \'active\': state{{x}} }" />');
        var directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).not.toContain('active');
      });
    });

  });
});
