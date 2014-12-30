describe("$swipe", function() {
  it("should work as expected with ng-swipe-left/right", function() {
    browser.get('/gestures/swipe.html');
    var elem = element(by.id('target'));
    var swipeLeft = element(by.id('swipeLeft'));
    var swipeRight = element(by.id('swipeRight'));
    
    expect(swipeRight.getText()).toEqual('false');
    expect(swipeLeft.getText()).toEqual('false');

    browser.actions()
           .mouseDown(elem)
           .mouseMove({x: 100, y: 0})
           .mouseUp()
           .perform();

    expect(swipeLeft.getText()).toEqual('false');
    expect(swipeRight.getText()).toEqual('true');

    browser.actions()
           .mouseDown(elem)
           .mouseMove({x: -100, y: 0})
           .mouseUp()
           .perform();

    expect(swipeLeft.getText()).toEqual('true');
  });
  
  it("nested swipe directives should work only for inner one", function() {
    browser.get('/gestures/swipe.html');
    var outer = element(by.id('outer'));
    var inner = element(by.id('inner'));
    var swipeLeftOuter = element(by.id('swipeLeftOuter'));
    var swipeLeftInner = element(by.id('swipeLeftInner'));
    
    expect(swipeLeftOuter.getText()).toEqual('false');
    expect(swipeLeftInner.getText()).toEqual('false');

    browser.actions()
           .mouseDown(inner)
           .mouseMove({x: -100, y: 0})
           .mouseUp()
           .perform();

    expect(swipeLeftOuter.getText()).toEqual('false');
    expect(swipeLeftInner.getText()).toEqual('true');
  });
});