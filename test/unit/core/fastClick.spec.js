'use strict';

describe('core', function() {
  describe('fastclick', function() {
    let scope;
    let compile;
    let fastclickOnTouchEnd;

    beforeEach(function() {
      FastClick.notNeeded = function() {
        return false;
      };

      spyOn(FastClick, 'attach').and.callThrough();
      spyOn(FastClick.prototype, 'onTouchEnd').and.callThrough();
      fastclickOnTouchEnd = FastClick.prototype.onTouchEnd;

      module('mobile-angular-ui.core.fastclick');

      inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    });

    it('should attach to document.body on run', function() {
      expect(FastClick.attach).toHaveBeenCalledWith(document.body);
    });

    it('forwards touchend events to original handler', function() {
      let event = new Event('touchend');
      event.changedTouches = [{}];
      document.body.dispatchEvent(event);
      expect(fastclickOnTouchEnd).toHaveBeenCalled();
    });

    it('adapts touchend events if missing event.changedTouches', function() {
      let event = new Event('touchend');
      document.body.dispatchEvent(event);
      expect(fastclickOnTouchEnd).toHaveBeenCalledWith(jasmine.objectContaining({
        changedTouches: [{}]
      }));
    });

    it('should add needsclick to input', function() {
      let elem = angular.element(
        '<input type="text">'
      );

      elem = compile(elem)(scope);
      scope.$digest();

      expect(elem.attr('class')).toContain('needsclick');
    });

    it('should add needsclick to select', function() {
      let elem = angular.element(
        '<select></select>'
      );

      elem = compile(elem)(scope);
      scope.$digest();

      expect(elem.attr('class')).toContain('needsclick');
    });

    it('should add needsclick to textarea', function() {
      let elem = angular.element(
        '<textarea></textarea>'
      );

      elem = compile(elem)(scope);
      scope.$digest();

      expect(elem.attr('class')).toContain('needsclick');
    });
  });
});
