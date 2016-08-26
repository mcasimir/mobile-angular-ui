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

    describe('ui-shared-state', function() {
      it('intializes a state on a scope', function() {
        scope.x = 1;

        let elem = angular.element(
          '<div ui-shared-state="state1"></div>'
        );

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.has('state1')).toBe(true);
      });

      it('intializes state with ui default', function() {
        scope.x = 1;

        let elem = angular.element('<div ui-shared-state="state1" ui-default="true" />');

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.values().state1).toBe(true);
      });

      it('should allow interpolation', function() {
        scope.x = 1;

        let elem = angular.element(
          '<div ui-shared-state="state{{x}}"></div>'
        );

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.has('state1')).toBe(true);
      });
    });

    describe('ui-state', function() {
      it('intializes a state on a scope', function() {
        scope.x = 1;

        let elem = angular.element(
          '<div ui-state="state1"></div>'
        );

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.has('state1')).toBe(true);
      });

      it('intializes state with ui default', function() {
        scope.x = 1;

        let elem = angular.element('<div ui-state="state1" ui-default="true" />');

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.values().state1).toBe(true);
      });

      it('should allow interpolation', function() {
        scope.x = 1;

        let elem = angular.element(
          '<div ui-state="state{{x}}"></div>'
        );

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.has('state1')).toBe(true);
      });
    });
  });
});
