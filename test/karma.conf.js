'use strict';

var src = require('../config').globs.js;

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
    // preprocessors: {
    //   'src/js/**/*.js': ['coverage']
    // },
    // coverageReporter: {
    //   type: 'lcov',
    //   dir: 'coverage'
    // },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,

    browsers: ['ChromeNoSandbox'],

    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    singleRun: true,
    concurrency: Infinity
  });
};
