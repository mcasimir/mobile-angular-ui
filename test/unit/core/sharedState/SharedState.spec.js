'use strict';

describe('core', function() {
  describe('sharedState', function() {
    let scope;
    let scope2;
    let SharedState;

    beforeEach(function() {
      module('mobile-angular-ui.core');
      inject(function($rootScope, _SharedState_) {
        scope = $rootScope.$new();
        scope2 = $rootScope.$new();
        SharedState = _SharedState_;
      });
    });

    describe('SharedState', function() {
      describe('initialize', function() {
        it('should set defaultValue if passed', function() {
          SharedState.initialize(scope, 'state1', {
            defaultValue: 'initialValue'
          });
          expect(SharedState.values().state1).toBe('initialValue');
        });

        it('should not override defaultValue if already set', function() {
          SharedState.initialize(scope, 'state1', {
            defaultValue: 'initialValue'
          });

          SharedState.initialize(scope2, 'state1', {
            defaultValue: 'initialValue2'
          });

          expect(SharedState.values().state1).toBe('initialValue');
        });

        it('garbage collects states when all scopes referencing it are destroyed', function() {
          SharedState.initialize(scope, 'state1', {
            defaultValue: 'initialValue'
          });

          SharedState.initialize(scope2, 'state1');
          scope.$destroy();
          scope2.$destroy();
          expect(SharedState.has('state1')).toBe(false);
        });

        it('does not garbage collect states untill all scopes referencing it are destroyed', function() {
          SharedState.initialize(scope, 'state1', {
            defaultValue: 'initialValue'
          });

          SharedState.initialize(scope2, 'state1');
          scope.$destroy();
          expect(SharedState.has('state1')).toBe(true);
        });
      });

      describe('referenceCount', function() {
        it('returns 0 if no references are present', function() {
          expect(SharedState.referenceCount('state1')).toBe(0);
        });

        it('returns 1 if one reference is present', function() {
          SharedState.initialize(scope, 'state1');
          expect(SharedState.referenceCount('state1')).toBe(1);
        });

        it('returns 2 if two references are present', function() {
          SharedState.initialize(scope, 'state1');
          SharedState.initialize(scope2, 'state1');
          expect(SharedState.referenceCount('state1')).toBe(2);
        });

        it('returns decremented value after a reference is gone', function() {
          SharedState.initialize(scope, 'state1');
          SharedState.initialize(scope2, 'state1');
          scope.$destroy();
          expect(SharedState.referenceCount('state1')).toBe(1);
        });
      });
    });
  });
});
