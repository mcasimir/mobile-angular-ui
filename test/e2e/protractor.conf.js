exports.config = {
  specs: ['demo/*.spec.js', 'app/*.spec.js'],
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
    require('babel-core/register');
    require('babel-polyfill');
    require('jasmine-es6/lib/install');

    let SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
  },
  jasmineNodeOpts: {
    print: function() {}
  },
  directConnect: true,
  baseUrl: 'http://0.0.0.0:8889'
};
