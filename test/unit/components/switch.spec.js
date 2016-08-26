'use strict';

describe('components', function() {
  describe('switch', function() {
    let scope;
    let compile;
    let $drag;

    let getServices = function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    };

    describe('ui-switch', function() {
      describe('without $drag', function() {
        beforeEach(function() {
          module('mobile-angular-ui.components');
          inject(getServices);
        });

        it('should add switch class to elem', function() {
          let elem = angular.element('<ui-switch />');
          compile(elem)(scope);
          scope.$digest();

          expect(elem.attr('class')).toContain('switch');
        });

        it('should add handle element on link', function() {
          let elem = angular.element('<ui-switch />');
          compile(elem)(scope);
          scope.$digest();
          let handle = elem[0].querySelectorAll('.switch-handle');
          expect(handle.length).toBe(1);
        });

        it('should add class active if ng-model is true', function() {
          scope.myModel = true;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          expect(elem.attr('class')).toContain('active');
        });

        it('should remove class active if ng-model is false', function() {
          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" class="active" />');
          compile(elem)(scope);
          scope.$digest();
          expect(elem.attr('class')).not.toContain('active');
        });

        it('should set model to true clicking on inactive switch', function() {
          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(true);
        });

        it('should set model to false clicking on active switch', function() {
          scope.myModel = true;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(false);
        });

        it('should call ngChange expression if set', function() {
          scope.myModel = false;
          scope.changeExpr = jasmine.createSpy('callback');

          let elem = angular.element('<ui-switch ng-model="myModel" ng-change="changeExpr()" />');
          compile(elem)(scope);
          scope.$digest();
          elem.triggerHandler('click');
          expect(scope.changeExpr).toHaveBeenCalled();
        });

        it('should call ngChange expression in the scope of parent', function() {
          scope.myModel = false;
          scope.x = 5;
          scope.changeExpr = jasmine.createSpy('callback');

          let elem = angular.element('<ui-switch ng-model="myModel" ng-change="changeExpr(x)" />');
          compile(elem)(scope);
          scope.$digest();
          elem.triggerHandler('click');
          expect(scope.changeExpr).toHaveBeenCalledWith(5);
        });

        it('should not call ngChange if disabled', function() {
          scope.myModel = false;
          scope.changeExpr = jasmine.createSpy('callback');

          let elem = angular.element('<ui-switch ng-model="myModel" ng-change="changeExpr()" disabled />');
          compile(elem)(scope);
          scope.$digest();
          elem.triggerHandler('click');
          expect(scope.changeExpr).not.toHaveBeenCalled();
        });

        it('should not commit model if disabled', function() {
          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" ng-change="changeExpr()" disabled />');
          compile(elem)(scope);
          scope.$digest();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(false);
        });

        it('should clear callbacks on elem $destroy', function() {
          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          elem.remove();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(false);
        });
      });

      describe('with $drag', function() {
        beforeEach(function() {
          $drag = {
            bind: jasmine.createSpy('bind'),
            TRANSLATE_INSIDE: jasmine.createSpy('TRANSLATE_INSIDE')
          };

          module('mobile-angular-ui.components', function($provide) {
            $provide.value('$drag', $drag);
          });
          inject(getServices);
        });

        it('calls $drag.bind on handle if available', function() {
          let elem = angular.element('<ui-switch />');
          compile(elem)(scope);
          scope.$digest();
          expect($drag.bind).toHaveBeenCalled();
          expect($drag.bind.calls.mostRecent().args[0][0]).toBe(elem[0].querySelectorAll('.switch-handle')[0]);
        });

        it('on $drag start unbinds click/tap callback', function() {
          let options;
          $drag.bind.and.callFake(function(elem, _options_) {
            options = _options_;
          });

          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          options.start();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(false);
        });

        it('on $drag cancel rebinds click/tap callback', function() {
          let options;
          $drag.bind.and.callFake(function(elem, _options_) {
            options = _options_;
          });

          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          options.start();
          options.cancel();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(true);
        });

        it('on $drag end sets model to true if handle is near switch end', function() {
          let options;
          $drag.bind.and.callFake(function(elem, _options_) {
            options = _options_;
          });
          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();

          let handle = elem[0].querySelectorAll('.switch-handle')[0];
          spyOn(handle, 'getBoundingClientRect').and.callFake(function() {
            return {
              width: 10,
              left: 9999,
              right: elem[0].getBoundingClientRect().right
            };
          });

          options.start();
          options.end();
          expect(scope.myModel).toBe(true);
        });

        it('on $drag end sets model to false if handle is near switch start', function() {
          let options;
          $drag.bind.and.callFake(function(elem, _options_) {
            options = _options_;
          });

          scope.myModel = true;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();

          let handle = elem[0].querySelectorAll('.switch-handle')[0];
          spyOn(handle, 'getBoundingClientRect').and.callFake(function() {
            return {
              width: 10,
              left: 0,
              right: 0
            };
          });

          options.start();
          options.end();
          expect(scope.myModel).toBe(false);
        });

        it('on $drag end does not change model if handle not near switch bounduaries', function() {
          let options;
          $drag.bind.and.callFake(function(elem, _options_) {
            options = _options_;
          });

          scope.myModel = true;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();

          let handle = elem[0].querySelectorAll('.switch-handle')[0];
          spyOn(handle, 'getBoundingClientRect').and.callFake(function() {
            return {
              width: 10,
              left: 9999,
              right: -9999
            };
          });

          options.start();
          options.end();
          expect(scope.myModel).toBe(true);
        });

        it('on $drag end rebinds click/tap callback', function() {
          let options;
          $drag.bind.and.callFake(function(elem, _options_) {
            options = _options_;
          });

          scope.myModel = false;
          let elem = angular.element('<ui-switch ng-model="myModel" />');
          compile(elem)(scope);
          scope.$digest();
          options.start();
          options.end();
          elem.triggerHandler('click');
          expect(scope.myModel).toBe(true);
        });
      });
    });

  });
});
