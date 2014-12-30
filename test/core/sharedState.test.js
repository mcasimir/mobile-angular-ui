describe('SharedState', function() {

  it('should be updated with uiTurnOn', function() {
    browser.get('/core/sharedState.html');
    element(by.id('turnOn')).click();
    expect(element(by.id('testState')).getText()).toEqual('true');
  });

  it("should not prevent ng-click", function() {
    browser.get('/core/sharedState.html');

    element(by.id('turnOnNgClick')).click();
    expect(element(by.id('testState')).getText()).toEqual('true');
    expect(element(by.id('myVar')).getText()).toEqual('5');
  });

  it('should always bind ui-* handlers after ng-click', function() {
    browser.get('/core/sharedState.html');
    expect(element(by.id('ngIfState')).getText()).toEqual('true');
    element(by.id('turnOnNgClickNgIf')).click();
    expect(element(by.id('ngIfState')).getText()).toEqual('false');
    expect(element(by.id('myVar')).getText()).toEqual('6');
    
  });

  it('should always bind ui-* handlers after ng-click', function() {
    browser.get('/core/sharedState.html');
    expect(element(by.id('ngIfState')).getText()).toEqual('true');
    element(by.id('turnOnNgClickNgIf')).click();
    expect(element(by.id('ngIfState')).getText()).toEqual('false');
    expect(element(by.id('myVar')).getText()).toEqual('6');
    
  });

  it("ui-* conditional directives should work", function() {
    browser.get('/core/sharedStateDirectives.html');

    var hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    expect(element(by.id('testState')).getText()).toEqual('true');

    var uiIfTrue = element(by.id('uiIfTrue'));
    var uiIfFalse = element(by.id('uiIfFalse'));
    var ngShowTrue = element(by.id('ngShowTrue'));
    var ngShowFalse = element(by.id('ngShowFalse'));
    var ngHideTrue = element(by.id('ngHideTrue'));
    var ngHideFalse = element(by.id('ngHideFalse'));
    var ngClassTrue = element(by.id('ngClassTrue'));
    var ngClassFalse = element(by.id('ngClassFalse'));

    expect(uiIfTrue.isPresent()).toBe(true);
    expect(uiIfFalse.isPresent()).toBe(false);
    expect(ngShowTrue.isDisplayed()).toBe(true);
    expect(ngShowFalse.isDisplayed()).toBe(false);
    expect(ngHideTrue.isDisplayed()).toBe(false);
    expect(ngHideFalse.isDisplayed()).toBe(true);
    expect(hasClass(ngClassTrue, 'active')).toBe(true);
    expect(hasClass(ngClassFalse, 'active')).toBe(false);

    var uiScopeContextUi1 = element(by.id('uiScopeContextUi1'));
    var uiScopeContextUi2 = element(by.id('uiScopeContextUi2'));
    var uiScopeContextUi3 = element(by.id('uiScopeContextUi3'));
    var uiScopeContextUi4 = element(by.id('uiScopeContextUi4'));
    var uiScopeContextUi5 = element(by.id('uiScopeContextUi5'));

    expect(uiScopeContextUi1.isPresent()).toBe(true);
    expect(uiScopeContextUi2.isPresent()).toBe(false);
    expect(uiScopeContextUi3.isDisplayed()).toBe(true);
    expect(uiScopeContextUi4.isDisplayed()).toBe(false);
    expect(hasClass(uiScopeContextUi5, 'active')).toBe(true);
  });

  it("should garbage collect", function() {
    browser.get('/core/sharedState.html');
    expect(element(by.id('refCount')).getText()).toEqual('1');
    element(by.id('attachElem2')).click();
    expect(element(by.id('refCount')).getText()).toEqual('2');
    element(by.id('detachElem2')).click();
    expect(element(by.id('refCount')).getText()).toEqual('1');
    element(by.id('detachElem1')).click();
    expect(element(by.id('has')).getText()).toEqual('false');
  });
});