'use strict';

describe('components', function() {
  describe('scrollable', function() {
    var scope;
    var compile;
    beforeEach(function() {
      module('mobile-angular-ui.components.scrollable');
      inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    });

    describe('scrollableContent', function() {
      it('adds overthrow class if overthrow support is not native', function() {
        var bkpOverthrowSupport = window.overthrow.support;
        window.overthrow.support = 'polyfilled';
        var elem = angular.element('<div class="scrollable-content" />');
        compile(elem)(scope);
        scope.$digest();
        expect(elem.attr('class')).toContain('overthrow');
        window.overthrow.support = bkpOverthrowSupport;
      });

      it('does not add overthrow class if overthrow support is native', function() {
        var bkpOverthrowSupport = window.overthrow.support;
        window.overthrow.support = 'native';
        var elem = angular.element('<div class="scrollable-content" />');
        compile(elem)(scope);
        scope.$digest();
        expect(elem.attr('class')).not.toContain('overthrow');
        window.overthrow.support = bkpOverthrowSupport;
      });

      xit('should be able to scroll to an element', function() {});
    });
  });
});
