'use strict';

describe('core', function() {
  describe('capture', function() {
    let scope;
    let compile;
    let Capture;

    beforeEach(function() {
      module('mobile-angular-ui.core.capture');
      inject(function($rootScope, $compile, _Capture_) {
        scope = $rootScope.$new();
        compile = $compile;
        Capture = _Capture_;
      });
    });

    describe('ui-yield-to', function() {
      it('should setup a yielder when linked', function() {
        spyOn(Capture, 'putYielder');

        let elem = angular.element(
          '<div ui-yield-to="placeholder"><span class="defaultContent"></span></div>'
        );

        compile(elem)(scope);
        scope.$digest();

        expect(Capture.putYielder).toHaveBeenCalledWith('placeholder', elem, scope, '<span class="defaultContent"></span>');
      });

      it('should remove yielder when element is destroyed', function() {
        spyOn(Capture, 'removeYielder');

        let elem = angular.element(
          '<div ui-yield-to="placeholder"><span class="defaultContent"></span></div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        elem.remove();

        expect(Capture.removeYielder).toHaveBeenCalledWith('placeholder');
      });

      it('should remove yielder when scope is destroyed', function() {
        spyOn(Capture, 'removeYielder');

        let elem = angular.element(
          '<div ui-yield-to="placeholder"><span class="defaultContent"></span></div>'
        );

        compile(elem)(scope);
        scope.$digest();
        scope.$destroy();

        expect(Capture.removeYielder).toHaveBeenCalledWith('placeholder');
      });

      it('should allow ng-click to work', function() {
        scope.ngClickCallback = jasmine.createSpy('ngClickCallback');

        let elem = angular.element(
          '<div ui-yield-to="placeholder"><a href ng-click="ngClickCallback()">Ng Click</a></div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        elem.find('a').triggerHandler('click');

        expect(scope.ngClickCallback).toHaveBeenCalled();
      });
    });

  });
});
