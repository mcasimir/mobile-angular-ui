exports.config = {
  directConnect: true,  
  specs: [
    '**/*.test.js',
  ],
  multiCapabilities: [{
    'browserName': 'firefox'
  }],

  baseUrl: 'http://localhost:3001',
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};