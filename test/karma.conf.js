'use strict';

var src = require('../config').globs.js;

var customLaunchersCi = {
  ciChrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  }
};

var customLaunchersLocal = {
  localChrome: {
    base: 'Chrome'
  }
};

var customLaunchers = process.env.CI ?
  customLaunchersCi :
    customLaunchersLocal;

var reporters = ['mocha', 'coverage'];

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
      'test/unit/**/*.spec.js'
    ]),

    preprocessors: {
      'src/js/**/*.js': ['coverage']
    },

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
    coverageReporter: {
      reporters: [
        {type: 'lcov'},
        {type: 'text-summary'}
      ],
      dir: 'coverage',
      subdir: function() {
        return '';
      }
    },
    singleRun: true,
    concurrency: 1
  });
};
