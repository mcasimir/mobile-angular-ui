'use strict';

describe('core', function() {
  describe('sharedState', function() {
    var scope;
    var compile;
    var SharedState;

    beforeEach(function() {
      module('mobile-angular-ui.core');
      inject(function($rootScope, $compile, _SharedState_) {
        scope = $rootScope.$new();
        compile = $compile;
        SharedState = _SharedState_;
      });
    });

    describe('ui-state', function() {
      it('intializes a state on a scope', function() {
        scope.x = 1;

        var elem = angular.element(
          '<div ui-state="state1"></div>'
        );

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.has('state1')).toBe(true);
      });

      it('intializes state with ui default', function() {
        scope.x = 1;

        var elem = angular.element('<div ui-state="state1" ui-default="true" />');

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.values().state1).toBe(true);
      });

      it('should allow interpolation', function() {
        scope.x = 1;

        var elem = angular.element(
          '<div ui-state="state{{x}}"></div>'
        );

        compile(elem)(scope);

        scope.$digest();
        expect(SharedState.has('state1')).toBe(true);
      });
    });
  });
});
