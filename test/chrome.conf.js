exports.config = {
  directConnect: true,
  chromeDriver: require('chromedriver').path,
  
  specs: [
    '**/*.test.js',
  ],
  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  baseUrl: 'http://localhost:3001',
  rootElement: 'body',
  jasmineNodeOpts: { includeStackTrace: true }
};