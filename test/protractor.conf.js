'use strict';

exports.config = {
  specs: ['test/e2e/*.spec.js'],
  capabilities: {
  browserName: 'chrome',
    chromeOptions: {
      args: [
        '--no-sandbox',
        '--touch-events=enabled'
      ]
    }
  },
  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },
  jasmineNodeOpts: {
    print: function() {}
  },
  directConnect: true,
  baseUrl: 'http://0.0.0.0:8888'
};
