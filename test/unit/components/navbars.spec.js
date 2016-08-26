'use strict';

describe('components', function() {
  describe('navbars', function() {
    let scope;
    let compile;
    let $rootElement;

    beforeEach(function() {
      $rootElement = angular.element(document.body);

      module('mobile-angular-ui.components.navbars', function($provide) {
        $provide.value('$rootElement', $rootElement);
      });

      inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
      });
    });

    describe('navbarAbsoluteTop', function() {
      it('adds class has-navbar-top if navbarAbsoluteTop is present', function() {
        let elem = angular.element('<div class="navbar-absolute-top" />');
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).toContain('has-navbar-top');
      });

      it('removes class has-navbar-top if navbarAbsoluteTop is destroyed', function() {
        let elem = angular.element('<div class="navbar-absolute-top" />');
        compile(elem)(scope);
        scope.$digest();
        scope.$destroy();
        expect($rootElement.attr('class')).not.toContain('has-navbar-top');
      });
    });

    describe('navbarAbsoluteBottom', function() {
      it('adds class has-navbar-bottom if navbarAbsoluteBottom is present', function() {
        let elem = angular.element('<div class="navbar-absolute-bottom" />');
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).toContain('has-navbar-bottom');
      });

      it('removes class has-navbar-bottom if navbarAbsoluteBottom is destroyed', function() {
        let elem = angular.element('<div class="navbar-absolute-bottom" />');
        compile(elem)(scope);
        scope.$digest();
        scope.$destroy();
        expect($rootElement.attr('class')).not.toContain('has-navbar-bottom');
      });
    });
  });
});
