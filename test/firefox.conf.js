exports.config = {
  seleniumServerJar: '../node_modules/selenium-standalone-jar/bin/selenium-server-standalone-2.45.0.jar',

  specs: [
    'htmlTests.js'
  ],
  multiCapabilities: [{
    'browserName': 'firefox'
  }],

  onPrepare: require('./onprepare'),
  rootElement: 'body',

  jasmineNodeOpts: {includeStackTrace: true}
};
