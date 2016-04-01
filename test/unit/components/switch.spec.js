'use strict';

describe('components', function() {
  describe('switch', function() {
    var scope;
    var compile;

    beforeEach(function() {
      module('mobile-angular-ui.components');
      inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    });

    describe('ui-switch', function() {
      it('should add switch class to elem', function() {
        var elem = angular.element('<ui-switch />');
        compile(elem)(scope);
        scope.$digest();

        expect(elem.attr('class')).toContain('switch');
      });

      it('should add handle element on link', function() {
        var elem = angular.element('<ui-switch />');
        compile(elem)(scope);
        scope.$digest();
        var handle = elem[0].querySelectorAll('.switch-handle');
        expect(handle.length).toBe(1);
      });
    });

  });
});
