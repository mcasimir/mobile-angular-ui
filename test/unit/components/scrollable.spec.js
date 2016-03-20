'use strict';

describe('components', function() {
  describe('scrollable', function() {
    let scope;
    let compile;

    beforeEach(function() {
      module('mobile-angular-ui.components');
      inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    });

    xit('should be able to scroll to an element', function() {});
    xit('should center an element when focused and window resizes (aka soft keyboard workaround)', function() {});
  });
});
