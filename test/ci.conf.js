/* globals process, exports, require */

exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'appium-version': '1.4',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'browserName': 'iphone',
    'platform': 'OS X 10.10',
    'version': '8.0',
    'deviceName': 'iPhone Simulator',
    'deviceOrientation': 'portrait'
  },
  specs: [
    'htmlTests.js'
  ],

  onPrepare: require('./onprepare'),
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};
