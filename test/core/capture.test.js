describe('Capture', function() {

  it('ngClick should work inside yieldTo', function() {
    browser.get('/core/capture.html');
    
    element(by.id('ngClick')).click();
    expect(element(by.id('myVar')).getText()).toEqual('1');
  });

});