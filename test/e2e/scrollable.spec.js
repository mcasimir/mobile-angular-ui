'use strict';

describe('scrollable', function() {
  // beforeEach(function(done) {
  //   browser.get('/test/e2e/app/#/scrollable')
  //   .then(done)
  //   .catch(done.fail);
  // });
  //
  // it('should center input and textareas when focused and window resizes (soft keyboard workaround)', function() {
  //   browser.driver.manage().window().setSize(600, 1200);
  //   element(by.id('textInput')).click();
  //   browser.sleep(100);
  //   browser.driver.manage().window().setSize(600, 500);
  //   browser.sleep(600);
  //   browser.executeAsyncScript(function(cb) {
  //     var elementInViewport = function(el) {
  //       var rect = el.getBoundingClientRect();
  //       return (
  //           rect.top >= 0 &&
  //           rect.left >= 0 &&
  //           rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
  //           rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  //       );
  //     };
  //     var input = document.getElementById('textInput');
  //     cb(elementInViewport(input));
  //   }).then(function(res) {
  //     expect(res).toEqual(true);
  //   });
  // });
});
