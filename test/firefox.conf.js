exports.config = {
  directConnect: true,  
  specs: [
    'htmlTests.js'
  ],
  multiCapabilities: [{
    'browserName': 'firefox'
  }],

  onPrepare: require('./onprepare'),
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};