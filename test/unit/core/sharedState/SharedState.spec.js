'use strict';

describe('core', function() {
  describe('sharedState', function() {
    let scope;
    let scope2;
    let SharedState;
    let $rootScope;
    let $log;

    beforeEach(function() {
      module('mobile-angular-ui.core.sharedState');

      inject(function(_$rootScope_, _$log_, _SharedState_) {
        scope = _$rootScope_.$new();
        scope2 = _$rootScope_.$new();
        SharedState = _SharedState_;
        $rootScope = _$rootScope_;
        $log = _$log_;
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

        it('should set exclusionGroup if passed', function() {
          SharedState.initialize(scope, 'state1', {
            exclusionGroup: 'excl1'
          });
          expect(SharedState.exclusionGroups().excl1.state1).toBe(true);
        });

        it('should remove exclusionGroup reference when a state is destroyed', function() {
          SharedState.initialize(scope, 'state1', {
            exclusionGroup: 'excl1'
          });

          SharedState.initialize(scope2, 'state2', {
            exclusionGroup: 'excl1'
          });

          scope.$destroy();

          expect(SharedState.exclusionGroups().excl1.state1).not.toBeDefined();
        });

        it('should delete the whole exclusionGroup when all states are destroyed', function() {
          SharedState.initialize(scope, 'state1', {
            exclusionGroup: 'excl1'
          });

          SharedState.initialize(scope2, 'state2', {
            exclusionGroup: 'excl1'
          });

          scope.$destroy();
          scope2.$destroy();
          expect(SharedState.exclusionGroups().excl1).not.toBeDefined();
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

        it('emits mobile-angular-ui.state.initialized.[STATE_ID] on successfull initialization', function() {
          spyOn($rootScope, '$broadcast');

          SharedState.initialize(scope, 'state1');

          expect($rootScope.$broadcast).toHaveBeenCalledWith('mobile-angular-ui.state.initialized.state1', undefined);
        });

        it('does not garbage collect states untill all scopes referencing it are destroyed', function() {
          SharedState.initialize(scope, 'state1', {
            defaultValue: 'initialValue'
          });

          SharedState.initialize(scope2, 'state1');
          scope.$destroy();
          expect(SharedState.has('state1')).toBe(true);
        });

        it('does not emit mobile-angular-ui.state.initialized.[STATE_ID] twice for the same state', function() {
          spyOn($rootScope, '$broadcast');

          SharedState.initialize(scope, 'state1');
          SharedState.initialize(scope2, 'state1');

          let calls = $rootScope.$broadcast.calls.allArgs().filter(function(args) {
            return args[0] === 'mobile-angular-ui.state.initialized.state1';
          });

          expect(calls.length).toBe(1);
        });
      });

      describe('setOne', function() {
        it('sets the value for a state', function() {
          SharedState.initialize(scope, 'state1');
          SharedState.setOne('state1', 'xyz');
          expect(SharedState.values().state1).toBe('xyz');
        });

        it('does not set anything and emits a warning if state is not initialized', function() {
          spyOn($log, 'warn');
          SharedState.setOne('state1', 'xyz');
          expect(SharedState.values().state1).not.toBeDefined();
          expect($log.warn).toHaveBeenCalledWith('Warning: Attempt to set uninitialized shared state: state1');
        });

        it('emits changed event if the state is changed', function() {
          SharedState.initialize(scope, 'state1', {
            defaultValue: 'abc'
          });
          spyOn($rootScope, '$broadcast');
          SharedState.setOne('state1', 'xyz');
          expect($rootScope.$broadcast).toHaveBeenCalledWith('mobile-angular-ui.state.changed.state1', 'xyz', 'abc');
        });
      });

      describe('setMany', function() {
        it('calls setOne for each keys', function() {
          spyOn(SharedState, 'setOne');

          SharedState.setMany({
            state1: 'a',
            state2: 'b'
          });

          expect(SharedState.setOne.calls.count()).toBe(2);
          expect(SharedState.setOne).toHaveBeenCalledWith('state1', 'a');
          expect(SharedState.setOne).toHaveBeenCalledWith('state2', 'b');
        });
      });

      describe('set', function() {
        it('calls setOne if first arg is a string', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'setMany');

          SharedState.set('x', 'y');

          expect(SharedState.setOne).toHaveBeenCalledWith('x', 'y');
        });

        it('does not call setMany if first arg is a string', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'setMany');

          SharedState.set('x', 'y');

          expect(SharedState.setMany).not.toHaveBeenCalled();
        });

        it('calls setMany if first arg is an object', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'setMany');

          SharedState.set({
            y: 'z'
          });

          expect(SharedState.setMany).toHaveBeenCalledWith({
            y: 'z'
          });
        });

        it('does not call setMany if first arg is a string', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'setMany');

          SharedState.set({
            y: 'z'
          });

          expect(SharedState.setOne).not.toHaveBeenCalled();
        });

        it('does not call setOne and setMany with null', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'setMany');

          SharedState.set(null, 5);

          expect(SharedState.setMany).not.toHaveBeenCalled();
          expect(SharedState.setOne).not.toHaveBeenCalled();
        });

        it('does not throw with null', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'setMany');

          expect(function() {
            SharedState.set(null, 5);
          }).not.toThrow();
        });
      });

      describe('turnOn', function() {
        it('calls setOne with true', function() {
          spyOn(SharedState, 'setOne');

          SharedState.turnOn('state1');

          expect(SharedState.setOne).toHaveBeenCalledWith('state1', true);
        });

        it('Turns off other statuses belonging to the same exclusion group.', function() {
          spyOn(SharedState, 'setOne');
          spyOn(SharedState, 'turnOff');

          SharedState.initialize(scope, 's1', {
            exclusionGroup: 'g1'
          });

          SharedState.initialize(scope, 's2', {
            exclusionGroup: 'g1'
          });

          SharedState.initialize(scope, 's3', {
            exclusionGroup: 'g1'
          });

          SharedState.turnOn('s3');

          expect(SharedState.turnOff).toHaveBeenCalledWith('s1');
          expect(SharedState.turnOff).toHaveBeenCalledWith('s2');
        });
      });

      describe('toggle', function() {
        it('should call turnOn if state is not set', function() {
          spyOn(SharedState, 'turnOn');
          spyOn(SharedState, 'turnOff');

          SharedState.initialize(scope, 's1');

          SharedState.toggle('s1');

          expect(SharedState.turnOn).toHaveBeenCalledWith('s1');
          expect(SharedState.turnOff).not.toHaveBeenCalledWith('s1');
        });

        it('should call turnOn if state is false', function() {
          spyOn(SharedState, 'turnOn');
          spyOn(SharedState, 'turnOff');

          SharedState.initialize(scope, 's1', {
            defaultValue: false
          });

          SharedState.toggle('s1');

          expect(SharedState.turnOn).toHaveBeenCalledWith('s1');
          expect(SharedState.turnOff).not.toHaveBeenCalledWith('s1');
        });

        it('should call turnOff if state is true', function() {
          spyOn(SharedState, 'turnOn');
          spyOn(SharedState, 'turnOff');

          SharedState.initialize(scope, 's1', {
            defaultValue: true
          });

          SharedState.toggle('s1');

          expect(SharedState.turnOn).not.toHaveBeenCalledWith('s1');
          expect(SharedState.turnOff).toHaveBeenCalledWith('s1');
        });
      });

      describe('turnOff', function() {
        it('calls setOne with false', function() {
          spyOn(SharedState, 'setOne');

          SharedState.turnOff('state1');

          expect(SharedState.setOne).toHaveBeenCalledWith('state1', false);
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
