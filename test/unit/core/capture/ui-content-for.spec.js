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

    describe('ui-content-for', function() {
      it('should set content for a yielder when linked', function() {
        spyOn(Capture, 'setContentFor');

        let elem = angular.element(
          '<div ui-content-for="placeholder"><span class="content"></span></div>'
        );

        compile(elem)(scope);
        scope.$digest();

        expect(Capture.setContentFor).toHaveBeenCalledWith('placeholder', '<span class="content"></span>', scope);
      });

      it('should remove content if uiDuplicate is not set', function() {
        let elem = angular.element(
          '<div ui-content-for="placeholder">Content</div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        expect(elem.text()).not.toContain('Content');
      });

      it('should keep and compile content if uiDuplicate is true', function() {
        let elem = angular.element(
          '<div ui-content-for="placeholder" ui-duplicate="true">Content {{1+1}}</div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        expect(elem.text()).toContain('Content 2');
      });
    });

  });
});
