exports.config = {
  directConnect: true,  
  specs: [
    'htmlTests.js'
  ],
  multiCapabilities: [{
    'browserName': 'firefox'
  }],

  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};