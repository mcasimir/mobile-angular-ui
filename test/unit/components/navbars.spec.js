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
        let elem = angular.element('<div class="navbar-absolute-top" nav-controller />');
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).toContain('has-navbar-top');
      });

      it('removes class has-navbar-top if navbarAbsoluteTop is destroyed', function() {
        let elem = angular.element('<div class="navbar-absolute-top" nav-controller />');
        compile(elem)(scope);
        scope.$digest();
        scope.$destroy();
        expect($rootElement.attr('class')).not.toContain('has-navbar-top');
      });
    });

    describe('navbarAbsoluteBottom', function() {
      it('adds class has-navbar-bottom if navbarAbsoluteBottom is present', function() {
        let elem = angular.element('<div class="navbar-absolute-bottom" nav-controller />');
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).toContain('has-navbar-bottom');
      });

      it('removes class has-navbar-bottom if navbarAbsoluteBottom is destroyed', function() {
        let elem = angular.element('<div class="navbar-absolute-bottom" nav-controller />');
        compile(elem)(scope);
        scope.$digest();
        scope.$destroy();
        expect($rootElement.attr('class')).not.toContain('has-navbar-bottom');
      });
    });

    describe('hideTopNav', function() {
      it('hides the navbarAbsoluteTop when present within the nested view', function() {
        let value = '<div><top class="navbar-absolute-top" nav-controller />';
        value += '<ng-view><div class="hide-top-nav"></div></ng-view></div>';
        let elem = angular.element(value);
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).not.toContain('has-navbar-top');
        expect(elem.find('top').attr('class')).toContain('ng-hide');
      });
    });

    describe('hideBottomNav', function() {
      it('hides the navbarAbsoluteBottom when present within the nested view', function() {
        let value = '<div><bottom class="navbar-absolute-bottom" nav-controller />';
        value += '<ng-view><div class="hide-bottom-nav"></div></ng-view></div>';
        let elem = angular.element(value);
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).not.toContain('has-navbar-bottom');
        expect(elem.find('bottom').attr('class')).toContain('ng-hide');
      });
    });

    describe('slideoutBottomNav', function() {
      it('hides the navbarAbsoluteBottom when present within the nested view', function() {
        let value = '<div><bottom class="navbar-absolute-bottom" nav-controller />';
        value += '<ng-view><div class="slideout-bottom-nav"></div></ng-view></div>';
        let elem = angular.element(value);
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).not.toContain('has-navbar-bottom');
        expect(elem.find('bottom').attr('class')).toContain('ng-hide');
      });
    });

    describe('slideoutTopNav', function() {
      it('hides the navbarAbsoluteTop when present within the nested view', function() {
        let value = '<div><top class="navbar-absolute-top" nav-controller />';
        value += '<ng-view><div class="slideout-top-nav"></div></ng-view></div>';
        let elem = angular.element(value);
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).not.toContain('has-navbar-top');
        expect(elem.find('top').attr('class')).toContain('ng-hide');
      });
    });

    describe('hideBothNav', function() {
      it('hides both navbarAbsoluteTop && navbarAbsoluteBottom when present within the nested view', function() {
        let value = '<div><bottom class="navbar-absolute-bottom" nav-controller />';
        value += '<top class="navbar-absolute-top" nav-controller /><ng-view>';
        value += '<div class="hide-both-nav"></div></ng-view></div>';
        let elem = angular.element(value);
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).not.toContain('has-navbar-bottom');
        expect($rootElement.attr('class')).not.toContain('has-navbar-top');
        expect(elem.find('bottom').attr('class')).toContain('ng-hide');
        expect(elem.find('top').attr('class')).toContain('ng-hide');
      });
    });

    describe('slideoutBothNav', function() {
      it('hides both navbarAbsoluteTop && navbarAbsoluteBottom when present within the nested view', function() {
        let value = '<div><bottom class="navbar-absolute-bottom" nav-controller />';
        value += '<top class="navbar-absolute-top" nav-controller /><ng-view>';
        value += '<div class="slideout-both-nav"></div></ng-view></div>';
        let elem = angular.element(value);
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).not.toContain('has-navbar-bottom');
        expect($rootElement.attr('class')).not.toContain('has-navbar-top');
        expect(elem.find('bottom').attr('class')).toContain('ng-hide');
        expect(elem.find('top').attr('class')).toContain('ng-hide');
      });
    });

  });
});
