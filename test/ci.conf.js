/* globals process, exports, require */

exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'browserName': 'iphone',
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
