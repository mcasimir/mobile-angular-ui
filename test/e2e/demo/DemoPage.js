import {createWriteStream} from 'fs';
import {resolve as resolvePath, join as joinPath} from 'path';

const SCREENSHOTS_PATH = resolvePath(process.cwd(), 'test', 'e2e', 'screenshots');

const SIDEBAR_LEFT_SELECTOR = by.css('.sidebar-left');
const SIDEBAR_RIGHT_SELECTOR = by.css('.sidebar-right');
const SIDEBAR_RIGHT_CONTENT_SELECTOR = by.css('.list-group-item:first-child .chat-user-avatar');
const HEADING_SELECTOR = by.css('.navbar-brand');

export default class DemoPage {
  async resize(w, h) {
    browser.driver.manage().window().setSize(w, h);
  }

  get heading() {
    return element(HEADING_SELECTOR);
  }

  get sidebarLeft() {
    return element(SIDEBAR_LEFT_SELECTOR);
  }

  get sidebarRight() {
    return element(SIDEBAR_RIGHT_SELECTOR);
  }

  get sidebarRightContent() {
    return element(SIDEBAR_RIGHT_CONTENT_SELECTOR);
  }

  get body() {
    return element(by.css('body'));
  }

  get toggleRightSidebarButton() {
    return element(by.css('.sidebar-right-toggle'));
  }

  get toggleLeftSidebarButton() {
    return element(by.css('.sidebar-toggle'));
  }

  async screenshot() {
    let png = await browser.takeScreenshot();
    let now = new Date().getTime();
    let filename = joinPath(SCREENSHOTS_PATH, `${now}.png`);
    let stream = createWriteStream(filename);
    stream.write(new Buffer(png, 'base64'));
    stream.end();
  }
}
