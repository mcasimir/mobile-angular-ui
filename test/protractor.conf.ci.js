'use strict';

exports.config = {
  seleniumAddress: 'http://chrome.maui-test-net:4444/wd/hub',
  specs: ['test/e2e/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }],
  baseUrl: 'http://server.maui-test-net:8888/test/e2e/app'
};
