'use strict';

describe('scrollable', function() {
  beforeEach(async function() {
    await browser.get('/test/e2e/app/#/scrollable');
  });
  //
  it('should center input and textareas when focused and window resizes (soft keyboard workaround)', async function() {
    await browser.driver.manage().window().setSize(600, 1200);
    await element(by.id('textInput')).click();
    await browser.sleep(100);
    await browser.driver.manage().window().setSize(600, 500);
    await browser.sleep(600);

    let res = await browser.executeAsyncScript(function(cb) {
      let elementInViewport = function(el) {
        let rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      };
      let input = document.getElementById('textInput');
      cb(elementInViewport(input));
    });

    expect(res).toEqual(true);
  });
});
