'use strict';

describe('core', function() {
  describe('capture', function() {
    var scope;
    var compile;
    var Capture;

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

        var elem = angular.element(
          '<div ui-content-for="placeholder"><span class="content"></span></div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        expect(Capture.setContentFor).toHaveBeenCalledWith('placeholder', '<span class="content"></span>', scope);
      });

      it('should remove content if uiDuplicate is not set', function() {
        var elem = angular.element(
          '<div ui-content-for="placeholder">Content</div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        expect(elem.text()).not.toContain('Content');
      });

      it('should keep and compile content if uiDuplicate is true', function() {
        var elem = angular.element(
          '<div ui-content-for="placeholder" ui-duplicate="true">Content {{1+1}}</div>'
        );

        elem = compile(elem)(scope);
        scope.$digest();

        expect(elem.text()).toContain('Content 2');
      });
    });

  });
});
