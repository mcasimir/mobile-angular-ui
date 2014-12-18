var jar = require('selenium-server-standalone-jar');
var chromedriver = require('chromedriver');



exports.config = {

  seleniumServerJar: jar.path,
  seleniumPort: null,
  seleniumArgs: [],
  seleniumAddress: null,

  chromeDriver: chromedriver.path,
  
  sauceUser: null,
  sauceKey: null,
  
  specs: [
    'core/*.js',
    'gestures/*.js',
    //'components/*.js'
  ],
  
  capabilities: {
    'browserName': 'chrome'
  },
  
  baseUrl: 'http://localhost:3001',
  rootElement: 'body',

  beforeLaunch: function() {},
  onPrepare: function() {},
  onComplete: function() {},
  onCleanUp: function(exitCode) {
    console.log('Everithing fine.. forcing grunt to exit.');
    process.exit(1);
  },
  afterLaunch: function() {},

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 30000
  }
};