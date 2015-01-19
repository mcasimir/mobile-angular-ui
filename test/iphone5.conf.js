exports.config = {
  directConnect: true,
  chromeDriver: require('chromedriver').path,
  specs: [
    'htmlTests.js'
  ],
  multiCapabilities: [{
    browserName: 'chrome',
    chromeOptions: {
        mobileEmulation: {
            deviceName: 'Apple iPhone 5'
        }
    }
  }],

  onPrepare: require('./onprepare'),
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};
