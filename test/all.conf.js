exports.config = {
  directConnect: true,
  chromeDriver: require('chromedriver').path,
  specs: [
    'htmlTests.js'
  ],
  
  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],

  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};