const SIDEBAR_LEFT_SELECTOR = by.css('.sidebar-left');
const SIDEBAR_RIGHT_SELECTOR = by.css('.sidebar-right');

export default class DemoPage {
  async resize(w, h) {
    browser.driver.manage().window().setSize(w, h);
  }

  async hasSidebarLeft() {
    return await element(SIDEBAR_LEFT_SELECTOR).isPresent();
  }

  async hasSidebarRight() {
    return await element(SIDEBAR_RIGHT_SELECTOR).isPresent();
  }

  getSidebarLeft() {
    return browser.findElement(SIDEBAR_LEFT_SELECTOR);
  }

  getSidebarRight() {
    return browser.findElement(SIDEBAR_RIGHT_SELECTOR);
  }
}
