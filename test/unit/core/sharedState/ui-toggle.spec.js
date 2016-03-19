'use strict';

describe('core', function() {
  describe('sharedState', function() {
    let scope;
    let compile;
    let SharedState;

    beforeEach(function() {
      module('mobile-angular-ui.core');
      inject(function($rootScope, $compile, _SharedState_) {
        scope = $rootScope.$new();
        compile = $compile;
        SharedState = _SharedState_;
      });
    });

    describe('ui-turn-on', function() {
      it('should bind after ng-click (1)', function() {
        let calls = [];
        scope.ngClickCallback = function() {
          calls.push('ngClick');
        };

        spyOn(SharedState, 'turnOn').and.callFake(function() {
          calls.push('turnOn');
        });

        let elem = angular.element(
          `<div ui-turn-on='state1' ng-click='ngClickCallback()' />`
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(calls).toEqual([
          'ngClick',
          'turnOn'
        ]);
      });

      it('should bind after ng-click (2)', function() {
        let calls = [];
        scope.ngClickCallback = function() {
          calls.push('ngClick');
        };

        spyOn(SharedState, 'turnOn').and.callFake(function() {
          calls.push('turnOn');
        });

        let elem = angular.element(
          `<div ng-click='ngClickCallback()' ui-turn-on='state1' />`
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(calls).toEqual([
          'ngClick',
          'turnOn'
        ]);
      });

    });
  });
});
