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

    describe('ui-turn-on', function() {
      it('runs on click', function() {
        spyOn(SharedState, 'turnOn');

        var elem = angular.element(
          '<div ui-turn-on="state1"/>'
        );

        var directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(SharedState.turnOn).toHaveBeenCalledWith('state1');
      });

      it('does not run on click if uiTriggers is not click', function() {
        spyOn(SharedState, 'turnOn');

        var elem = angular.element(
          '<div ui-turn-on="state1" ui-triggers="tap"/>'
        );

        var directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(SharedState.turnOn).not.toHaveBeenCalledWith('state1');
      });

      it('runs on tap if uiTriggers is tap', function() {
        spyOn(SharedState, 'turnOn');

        var elem = angular.element(
          '<div ui-turn-on="state1" ui-triggers="tap"/>'
        );

        var directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('tap');

        expect(SharedState.turnOn).toHaveBeenCalledWith('state1');
      });

      it('should bind after ng-click (1)', function() {
        var calls = [];
        scope.ngClickCallback = function() {
          calls.push('ngClick');
        };

        spyOn(SharedState, 'turnOn').and.callFake(function() {
          calls.push('turnOn');
        });

        var elem = angular.element(
          '<div ui-turn-on="state1" ng-click="ngClickCallback()" />'
        );

        var directiveElement = compile(elem)(scope);

        scope.$digest();

        directiveElement.triggerHandler('click');

        expect(calls).toEqual([
          'ngClick',
          'turnOn'
        ]);
      });

      it('should bind after ng-click (2)', function() {
        var calls = [];
        scope.ngClickCallback = function() {
          calls.push('ngClick');
        };

        spyOn(SharedState, 'turnOn').and.callFake(function() {
          calls.push('turnOn');
        });

        var elem = angular.element(
          '<div ng-click="ngClickCallback()" ui-turn-on="state1" />'
        );

        var directiveElement = compile(elem)(scope);

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
