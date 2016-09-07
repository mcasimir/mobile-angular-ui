import DemoPage from './DemoPage';

export default class OverlaysPage extends DemoPage {
  static async get() {
    await browser.get('/demo/#/overlay');
    return new OverlaysPage();
  }

  get openModalButton() {
    return element(by.css('[ui-turn-on="modal1"]'));
  }

  get openOverlayButton() {
    return element(by.css('[ui-turn-on="modal2"]'));
  }

  get modalDialog() {
    return element(by.css('[ui-shared-state="modal1"]'));
  }

  get overlayDialog() {
    return element(by.css('[ui-shared-state="modal2"]'));
  }
}
