// <!-- uiScopeContext -->
//
// <div id="uiScopeContextUi1" ui-if="trueVar" ui-scope-context='trueVar'>uiScopeContextUi1</div>
// <div id="uiScopeContextUi2" ui-if="falseVar" ui-scope-context='falseVar'>uiScopeContextUi2</div>
// <div id="uiScopeContextUi3" ui-show="falseVar || testState" ui-scope-context='falseVar'>uiScopeContextUi3</div>
// <div id="uiScopeContextUi4" ui-hide="myVar || testState" ui-scope-context='falseVar as myVar'>uiScopeContextUi4</div>
// <div id="uiScopeContextUi5" ui-class="{'active': !myVar && trueVar}" ui-scope-context='trueVar, falseVar as myVar'>uiScopeContextUi5</div>
// <div id='uiScopeContextUi6' ui-hide="trueVar" ui-scope-context="nested.trueProp as trueVar"></div>


describe('core', function() {
  describe('sharedState', function() {
    let scope;
    let compile;
    let SharedState;

    beforeEach(function() {
      module('mobile-angular-ui.core');
      inject(function($rootScope, $compile, _SharedState_) {
        scope = $rootScope.$new();
        compile = $compile;
        SharedState = _SharedState_;
      });
    });

    describe('ui-scope-context', function() {
      it('should expose scope variable to state expression', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        scope.x = true;
        let elem = angular.element(`<div ui-class="{ 'active': state1 || x }" ui-scope-context="x" />`);
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should allow to rename a variable', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        scope.x = true;
        let elem = angular.element(`<div ui-class="{ 'active': state1 || y }" ui-scope-context="x as y" />`);
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should allow to expose multiple variables', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        scope.x = false;
        scope.y = true;
        let elem = angular.element(`<div ui-class="{ 'active': state1 || x || y }" ui-scope-context="x, y" />`);
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should allow to expose multiple variables renaming some', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        scope.x = false;
        scope.z = true;
        let elem = angular.element(`<div ui-class="{ 'active': state1 || x || y }" ui-scope-context="x, z as y" />`);
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

      it('should allow to expose nested variables with alias', function() {
        SharedState.initialize(scope, 'state1', {defaultValue: false});

        scope.x = 1;
        scope.y = {
          z: 1
        };

        let elem = angular.element(`<div ui-class="{ 'active': state1 || ((x + z) === 2) }" ui-scope-context="x, y.z as z" />`);
        let directiveElement = compile(elem)(scope);

        scope.$digest();

        expect(directiveElement.attr('class')).toContain('active');
      });

    });

  });
});
