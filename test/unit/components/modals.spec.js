'use strict';

describe('components', function() {
  let scope;
  let compile;
  let $rootElement;

  beforeEach(function() {
    $rootElement = angular.element(document.body);

    module('mobile-angular-ui.components.modals', function($provide) {
      $provide.value('$rootElement', $rootElement);
    });

    inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      compile = $compile;
    });
  });

  describe('modal', function() {
    it('adds class has-modal if modal is present', function() {
      let elem = angular.element('<div class="modal" />');
      compile(elem)(scope);
      scope.$digest();

      expect($rootElement.attr('class')).toContain('has-modal');
    });

    it('removes class has-modal if modal scope is destroyed', function() {
      let elem = angular.element('<div class="modal" />');
      compile(elem)(scope);
      scope.$digest();
      scope.$destroy();
      expect($rootElement.attr('class')).not.toContain('has-modal');
    });

    it('removes class has-modal if modal element is destroyed', function() {
      let elem = angular.element('<div class="modal" />');
      compile(elem)(scope);
      scope.$digest();
      elem.remove();
      expect($rootElement.attr('class')).not.toContain('has-modal');
    });

    it('adds class has-modal-overlay to rootElement if element has class modal-overlay', function() {
      let elem = angular.element('<div class="modal modal-overlay" />');
      compile(elem)(scope);
      scope.$digest();

      expect($rootElement.attr('class')).toContain('has-modal-overlay');
    });

    it('removes class has-modal-overlay from rootElement if element scope is destroyed', function() {
      let elem = angular.element('<div class="modal modal-overlay" />');
      compile(elem)(scope);
      scope.$digest();
      scope.$destroy();
      expect($rootElement.attr('class')).not.toContain('has-modal-overlay');
    });

    it('removes class has-modal-overlay from rootElement if element is destroyed', function() {
      let elem = angular.element('<div class="modal modal-overlay" />');
      compile(elem)(scope);
      scope.$digest();
      elem.remove();
      expect($rootElement.attr('class')).not.toContain('has-modal-overlay');
    });
  });
});
