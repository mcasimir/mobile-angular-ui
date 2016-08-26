'use strict';

describe('core', function() {
  describe('capture', function() {
    let scope;
    let $rootScope;
    let Capture;

    beforeEach(function() {
      module('mobile-angular-ui.core.capture');
      inject(function(_$rootScope_, $compile, _Capture_) {
        $rootScope = _$rootScope_;
        scope = _$rootScope_.$new();
        Capture = _Capture_;
      });
    });

    it('Should call resetAll on $routeChangeSuccess', function() {
      spyOn(Capture, 'resetAll');
      $rootScope.$broadcast('$routeChangeSuccess', {});
      expect(Capture.resetAll).toHaveBeenCalled();
    });

    describe('Capture', function() {

      describe('resetAll', function() {
        it('Should call resetYielder on all the yielders', function() {
          spyOn(Capture, 'resetYielder');
          Capture.yielders.yielder1 = '';
          Capture.yielders.yielder2 = '';

          Capture.resetAll();

          expect(Capture.resetYielder).toHaveBeenCalledWith('yielder1');
          expect(Capture.resetYielder).toHaveBeenCalledWith('yielder2');
        });
      });

      describe('resetYielder', function() {
        it('Should reset contents for a yielder calling setContentFor with defaultContent and defaultScope from the yieleder data', function() {
          spyOn(Capture, 'setContentFor');
          Capture.yielders.yielder1 = {
            defaultContent: 'content',
            defaultScope: 'scope'
          };

          Capture.resetYielder('yielder1');

          expect(Capture.setContentFor).toHaveBeenCalledWith('yielder1', 'content', 'scope');
        });
      });

      describe('putYielder', function() {
        it('Should add a yielder to yielders', function() {
          Capture.putYielder('yielder1', 'elem1', 'defaultScope1', 'defaultContent1');

          expect(Capture.yielders.yielder1).toEqual({
            name: 'yielder1',
            element: 'elem1',
            defaultContent: 'defaultContent1',
            defaultScope: 'defaultScope1'
          });
        });
      });

      describe('getYielder', function() {
        it('Should return a yielder by name', function() {
          let yielder1 = {
            defaultContent: 'content',
            defaultScope: 'scope'
          };

          Capture.yielders.yielder1 = yielder1;

          expect(Capture.getYielder('yielder1')).toBe(yielder1);
        });
      });

      describe('removeYielder', function() {
        it('Should remove a yielder by name', function() {
          let yielder1 = {
            defaultContent: 'content',
            defaultScope: 'scope'
          };

          Capture.yielders.yielder1 = yielder1;
          Capture.removeYielder('yielder1');

          expect(Capture.yielders.yielder1).not.toBeDefined();
        });
      });

      describe('setContentFor', function() {
        it('Should not throw if matching yielder not found', function() {
          expect(function() {
            Capture.setContentFor('yielder1');
          }).not.toThrow();
        });

        it('Should set content on matching yielder', function() {
          let elem = angular.element('<div></div>');
          Capture.yielders.yielder1 = {
            element: elem
          };

          Capture.setContentFor('yielder1', 'Content', scope);

          expect(elem.text()).toContain('Content');
        });

        it('Should compile content against scope', function() {
          let elem = angular.element('<div></div>');
          scope.greeting = 'Hello';
          Capture.yielders.yielder1 = {
            element: elem
          };

          Capture.setContentFor('yielder1', '{{greeting}}', scope);
          scope.$digest();
          expect(elem.text()).toContain('Hello');
        });
      });

    });
  });
});
