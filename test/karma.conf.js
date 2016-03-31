'use strict';

var PATH_SEPARATOR = process.platform === 'win32' ? ';' : ':';
var webdriver = require('selenium-webdriver');
var chromedriver = require('chromedriver');
var src = require('../config').globs.js;
process.env.PATH = chromedriver.path + PATH_SEPARATOR + process.env.PATH;

var customLaunchers = {
  chrome: {
    base: 'SeleniumWebdriver',
    browserName: 'Chrome',
    getDriver: function() {
      var driver = new webdriver.Builder()
          .forBrowser('chrome')
          .usingServer('http://chrome.maui-test-net:4444/wd/hub')
          .build();
      return driver;
    }
  }
};

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

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),

    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      reporters: [
        {type: 'lcov'},
        {type: 'text-summary'}
      ],
      dir: 'coverage',
      subdir: function() {return '';}
    },

    singleRun: true,
    concurrency: 1,
    hostname: 'karma.maui-test-net',
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO
  });
};
