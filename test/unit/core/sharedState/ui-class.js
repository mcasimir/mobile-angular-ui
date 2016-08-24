'use strict';

describe('core', function() {
  describe('sharedState', function() {
    let scope;
    let compile;
    let SharedState;

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

        let elem = angular.element('<div ui-class="{ \'active\': state1 }" />');
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should not set defined class if state is false', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        let elem = angular.element('<div ui-class="{ \'active\': state1 }" />');
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).not.toContain('active');
      });

      it('should set defined class if interpolated state is true', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: true});
        scope.x = 1;

        let elem = angular.element('<div ui-class="{ \'active\': state{{x}} }" />');
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should not set defined class if interpolated state is false', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});
        scope.x = 1;

        let elem = angular.element('<div ui-class="{ \'active\': state{{x}} }" />');
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).not.toContain('active');
      });
    });

  });
});
