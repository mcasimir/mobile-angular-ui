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
      'test/unit/**/*.spec.js'
    ]),

    preprocessors: {
      'src/js/**/*.js': ['coverage']
    },

    browsers: ['Chrome'],

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
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO
  });
};
