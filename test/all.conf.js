exports.config = {
  // seleniumServerJar: require('selenium-server-standalone-jar').path,
  directConnect: true,
  chromeDriver: require('chromedriver').path,
  specs: [
    '**/*.test.js',
  ],
  
  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],

  baseUrl: 'http://localhost:3001',
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};