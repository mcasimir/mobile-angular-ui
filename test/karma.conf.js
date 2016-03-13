'use strict';

var src = require('../config').globs.js;

var customLaunchersCi = {
  ciChrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  }
  // ciIphone: {
  //   base: 'SauceLabs',
  //   browserName: 'iphone',
  //   platform: 'OS X 10.9',
  //   version: '7.1'
  // }
};

var customLaunchersLocal = {
  localChrome: {
    base: 'Chrome'
  }
};

var customLaunchers = process.env.CI ?
  customLaunchersCi :
    customLaunchersLocal;

var reporters = ['mocha'];

if (process.env.CI) {
  reporters.push('saucelabs');
}

module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'node_modules/angular/angular.js',
    ].concat(src)
      .concat([
      'node_modules/angular-mocks/angular-mocks.js',
      'test/unit/*.spec.js'
    ]),

    captureTimeout: 120000,
    sauceLabs: {
      testName: `mobile-angular-ui@${process.env.TRAVIS_BRANCH || 'local'} (build #${process.env.TRAVIS_BUILD_NUMBER || 'local'})`
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    reporters: reporters,
    singleRun: true,
    concurrency: 1
  });
};
