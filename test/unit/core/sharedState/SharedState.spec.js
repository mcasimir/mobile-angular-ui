'use strict';

describe('core', function() {
  describe('sharedState', function() {
    let scope;
    let SharedState;

    beforeEach(function() {
      module('mobile-angular-ui.core');
      inject(function($rootScope, _SharedState_) {
        scope = $rootScope.$new();
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
      });
    });
  });
});
