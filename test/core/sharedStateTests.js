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