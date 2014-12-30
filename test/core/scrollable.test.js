describe('Scrollable', function() {
  it('should be able to scroll to an element', function() {
    browser.driver.manage().window().setSize(600, 600);
    browser.get('/core/scrollable.html');
    browser.executeAsyncScript(function(cb) {
      var elementInViewport = function(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      };
      var scrollableContent = angular.element(document.getElementById('scrollableContent'));
      var controller = scrollableContent.controller('scrollableContent');
      var input = document.getElementById('textInput');

      controller.scrollTo(input);
      cb(elementInViewport(input));
    }).then(function(res) {
      expect(res).toEqual(true); 
    });
  });

  it('should center an element when focused and window resizes (aka soft keyboard workaround)', function() {
    browser.get('/core/scrollable.html');

    element(by.id('textInput')).click();
    browser.sleep(100);
    browser.driver.manage().window().setSize(600, 500);
    browser.sleep(600);
    
    browser.executeAsyncScript(function(cb) {
      var elementInViewport = function(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      };
      var input = document.getElementById('textInput');
      cb(elementInViewport(input));
    }).then(function(res) {
      expect(res).toEqual(true);
    });
  });

});