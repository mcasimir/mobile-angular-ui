import DemoPage from './DemoPage';

export default class HomePage extends DemoPage {
  static async get() {
    await browser.get('/demo/#/');
    return new HomePage();
  }
}
