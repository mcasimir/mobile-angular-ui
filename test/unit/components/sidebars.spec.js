'use strict';

describe('components', function() {
  describe('sidebars', function() {
    let scope;
    let compile;
    let $rootElement;
    let $rootScope;
    let $location;
    let SharedState;
    let bindOuterClick;

    beforeEach(function() {
      $rootElement = angular.element(document.body);
      bindOuterClick = jasmine.createSpy('bindOuterClick');
      module('mobile-angular-ui.components.sidebars', function($provide) {
        $provide.value('$rootElement', $rootElement);
        $provide.value('bindOuterClick', bindOuterClick);
      });

      inject(function(_$rootScope_, $compile, _SharedState_, _$location_) {
        scope = _$rootScope_.$new();
        compile = $compile;
        $rootScope = _$rootScope_;
        SharedState = _SharedState_;
        $location = _$location_;
      });
    });

    describe('sidebarLeft', function() {
      it('adds class has-sidebar-left to rootElement on link', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();

        expect($rootElement.attr('class')).toContain('has-sidebar-left');
      });

      it('adds sidebar-left-visible when associated state changes to true', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        $rootScope.$broadcast('mobile-angular-ui.state.changed.uiSidebarLeft', true);
        expect($rootElement.attr('class')).toContain('sidebar-left-visible');
      });

      it('adds sidebar-left-in when associated state changes to true', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        $rootScope.$broadcast('mobile-angular-ui.state.changed.uiSidebarLeft', true);
        expect($rootElement.attr('class')).toContain('sidebar-left-in');
      });

      it('removes sidebar-left-in when associated state changes to false', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        $rootElement.addClass('sidebar-left-in');
        $rootScope.$broadcast('mobile-angular-ui.state.changed.uiSidebarLeft', false);
        expect($rootElement.attr('class')).not.toContain('sidebar-left-in');
      });

      it('resets associated state on $routeChangeSuccess', function() {
        SharedState.initialize(scope, 'uiSidebarLeft', {
          defaultValue: true
        });

        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        expect(SharedState.get('uiSidebarLeft')).toBe(true);
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(SharedState.get('uiSidebarLeft')).toBe(false);
      });

      it('initializes associated state to false', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        expect(SharedState.get('uiSidebarLeft')).not.toBe(true);
      });

      it('initializes associated state to true if attr.active', function() {
        let elem = angular.element('<div class="sidebar-left" active/>');
        compile(elem)(scope);
        scope.$digest();
        expect(SharedState.get('uiSidebarLeft')).toBe(true);
      });

      it('removes activeClass on app transitionend', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();

        spyOn(SharedState, 'isActive').and.callFake(function() {
          return false;
        });

        spyOn($rootElement, 'removeClass');
        $rootScope.$broadcast('mobile-angular-ui.app.transitionend');
        expect($rootElement.removeClass).toHaveBeenCalledWith('sidebar-left-visible');
      });

      it('does not remove activeClass on app transitionend if state is active again', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();

        spyOn(SharedState, 'isActive').and.callFake(function() {
          return true;
        });

        spyOn($rootElement, 'removeClass');
        $rootScope.$broadcast('mobile-angular-ui.app.transitionend');
        expect($rootElement.removeClass).not.toHaveBeenCalledWith('sidebar-left-visible');
      });

      it('names associated state after id attribute', function() {
        let elem = angular.element('<div class="sidebar-left" id="mySidebar" />');
        compile(elem)(scope);
        scope.$digest();
        expect(SharedState.has('mySidebar')).toBe(true);
      });

      it('removes sidebar-left-in from $rootElement on scope destroy', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        spyOn($rootElement, 'removeClass');
        scope.$destroy();
        expect($rootElement.removeClass).toHaveBeenCalledWith('sidebar-left-in');
      });

      it('removes sidebar-left-visible from $rootElement on scope destroy', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        spyOn($rootElement, 'removeClass');
        scope.$destroy();
        expect($rootElement.removeClass).toHaveBeenCalledWith('sidebar-left-visible');
      });

      it('removes has-sidebar-left from $rootElement on scope destroy', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        spyOn($rootElement, 'removeClass');
        scope.$destroy();
        expect($rootElement.removeClass).toHaveBeenCalledWith('has-sidebar-left');
      });

      it('binds outerClicks if attrs.closeOnOuterClicks !== false', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        expect(bindOuterClick).toHaveBeenCalled();
      });

      it('does not bind outerClicks if attrs.closeOnOuterClicks === false', function() {
        let elem = angular.element('<div class="sidebar-left" close-on-outer-clicks="false" />');
        compile(elem)(scope);
        scope.$digest();
        expect(bindOuterClick).not.toHaveBeenCalled();
      });

      it('checks if sidebar is active on the outerClicks condition', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        let condition = bindOuterClick.calls.mostRecent().args[3];
        spyOn(SharedState, 'isActive').and.callThrough();
        SharedState.setOne('uiSidebarLeft', false);
        expect(condition()).toBe(false);
        expect(SharedState.isActive).toHaveBeenCalledWith('uiSidebarLeft');

        SharedState.isActive.calls.reset();

        SharedState.setOne('uiSidebarLeft', true);
        expect(condition()).toBe(true);
        expect(SharedState.isActive).toHaveBeenCalledWith('uiSidebarLeft');
      });

      it('turns associated state off in outerClicks callback', function() {
        let elem = angular.element('<div class="sidebar-left" />');
        compile(elem)(scope);
        scope.$digest();
        let callback = bindOuterClick.calls.mostRecent().args[2];
        spyOn(SharedState, 'turnOff').and.callThrough();
        SharedState.setOne('uiSidebarLeft', true);
        callback();
        expect(SharedState.turnOff).toHaveBeenCalledWith('uiSidebarLeft');
      });

      it('sync $location.search on associated state changes if attr uiTrackAsSearchParam', function() {
        let elem = angular.element('<div class="sidebar-left" ui-track-as-search-param />');
        compile(elem)(scope);
        scope.$digest();
        spyOn($location, 'search');

        $rootScope.$broadcast('mobile-angular-ui.state.changed.uiSidebarLeft', true);
        expect($location.search).toHaveBeenCalledWith('uiSidebarLeft', true);

        $location.search.calls.reset();

        $rootScope.$broadcast('mobile-angular-ui.state.changed.uiSidebarLeft', false);
        expect($location.search).toHaveBeenCalledWith('uiSidebarLeft', null);
      });

      it('sync associated state with $location.search if attr uiTrackAsSearchParam', function() {
        let elem = angular.element('<div class="sidebar-left" ui-track-as-search-param />');
        compile(elem)(scope);
        scope.$digest();

        SharedState.setOne('uiSidebarLeft', false);
        $location.search('uiSidebarLeft', true);

        $rootScope.$broadcast('$routeUpdate');
        expect(SharedState.get('uiSidebarLeft')).toBe(true);

        SharedState.setOne('uiSidebarLeft', true);
        $location.search('uiSidebarLeft', null);

        $rootScope.$broadcast('$routeUpdate');
        expect(SharedState.get('uiSidebarLeft')).toBe(false);
      });
    });

    describe('app', function() {
      it('forwards transitionend through $broadcast', function() {
        spyOn($rootScope, '$broadcast');

        let elem = angular.element('<div class="app" />');
        compile(elem)(scope);
        scope.$digest();
        elem.triggerHandler('transitionend');
        expect($rootScope.$broadcast).toHaveBeenCalled();
      });
    });
  });
});
