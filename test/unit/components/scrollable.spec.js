'use strict';

describe('components', function() {
  describe('scrollable', function() {
    var scope;
    var compile;
    var injectServices = function() {
      inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    };

    var elementInViewport = function(el) {
      var rect = el.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    beforeEach(function() {
      module('mobile-angular-ui.components.scrollable');
      injectServices();
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

      it('should be able to scroll to an element', function() {
        var scrollable = angular.element('<div class="scrollable" style="position:absolute;width:100%;height:100%;top:0;bottom:0;left:0;right:0;"></div>');
        var elem = angular.element('<div class="scrollable-content" style="width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;"/>');
        var lastContent;
        for (var i = 0; i < 2000; i++) {
          var content = angular.element('<div style="height:1px;"></div>');
          elem.append(content);
          if (i === 1999) {
            lastContent = content;
          }
        }
        scrollable.append(elem);
        compile(elem)(scope);
        scope.$digest();
        angular.element(document.body).append(scrollable);
        var controller = elem.controller('scrollableContent');
        expect(elementInViewport(lastContent[0])).toBe(false);
        controller.scrollTo(lastContent);
        expect(elementInViewport(lastContent[0])).toBe(true);
      });
    });
  });
});
