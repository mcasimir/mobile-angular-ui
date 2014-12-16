describe('SharedState', function() {
  it('should be updated with uiTurnOff', function() {
    browser.get('/core/sharedState.html');

    var res = browser.executeScript(function() {
      var SharedState = angular.element(document.body).injector().get('SharedState');
      return SharedState.isActive('testState');
    });

    expect(res).toEqual(false);
  });
});