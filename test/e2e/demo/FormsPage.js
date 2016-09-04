import DemoPage from './DemoPage';

export default class FormsPage extends DemoPage {
  static async get() {
    await browser.get('/demo/#/forms');
    return new FormsPage();
  }

  get uiSwitchHandle() {
    return element(by.css('.switch-handle'));
  }

  get uiSwitch() {
    return element(by.css('ui-switch'));
  }

  get emailInput() {
    return element(by.css('input[type="email"]'));
  }

  get passwordInput() {
    return element(by.css('input[type="password"]'));
  }
}
