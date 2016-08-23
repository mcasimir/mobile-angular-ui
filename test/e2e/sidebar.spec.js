/* global browser, by */

'use strict';

describe('sidebar', function() {
  beforeEach(function() {
    browser.get('/demo/#/');
  });

  it('should display the sidebar on desktop', function(done) {
    browser.driver.manage().window().setSize(1200, 800);
    let sidebar = browser.findElement(by.css('.sidebar-left'));
    sidebar.isDisplayed()
      .then(function(displayed) {
        if (!displayed) {
          console.log('here');
          return Promise.reject('sidebar not visible');
        }
        done();
      })
      .catch(done.fail);
  });

  it('should not display the sidebar on mobile', function(done) {
    browser.driver.manage().window().setSize(300, 800);
    let sidebar = browser.findElement(by.css('.sidebar-left'));
    sidebar.isDisplayed()
      .then(function(displayed) {
        if (displayed) {
          console.log('here');
          return Promise.reject('sidebar visible');
        }
        done();
      })
      .catch(done.fail);
  });
});
