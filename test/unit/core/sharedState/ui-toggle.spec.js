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

    describe('ui-toggle', function() {
      it('runs on click', function() {
        spyOn(SharedState, 'toggle');

        let elem = angular.element(
          '<div ui-toggle="state1"/>'
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(SharedState.toggle).toHaveBeenCalledWith('state1');
      });

      it('does not run on click if uiTriggers is not click', function() {
        spyOn(SharedState, 'toggle');

        let elem = angular.element(
          '<div ui-toggle="state1" ui-triggers="tap"/>'
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(SharedState.toggle).not.toHaveBeenCalledWith('state1');
      });

      it('runs on tap if uiTriggers is tap', function() {
        spyOn(SharedState, 'toggle');

        let elem = angular.element(
          '<div ui-toggle="state1" ui-triggers="tap"/>'
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('tap');

        expect(SharedState.toggle).toHaveBeenCalledWith('state1');
      });

      it('should bind after ng-click (1)', function() {
        let calls = [];
        scope.ngClickCallback = function() {
          calls.push('ngClick');
        };

        spyOn(SharedState, 'toggle').and.callFake(function() {
          calls.push('toggle');
        });

        let elem = angular.element(
          '<div ui-toggle="state1" ng-click="ngClickCallback()" />'
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(calls).toEqual([
          'ngClick',
          'toggle'
        ]);
      });

      it('should bind after ng-click (2)', function() {
        let calls = [];
        scope.ngClickCallback = function() {
          calls.push('ngClick');
        };

        spyOn(SharedState, 'toggle').and.callFake(function() {
          calls.push('toggle');
        });

        let elem = angular.element(
          '<div ng-click="ngClickCallback()" ui-toggle="state1" />'
        );

        let directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(calls).toEqual([
          'ngClick',
          'toggle'
        ]);
      });
    });
  });
});
