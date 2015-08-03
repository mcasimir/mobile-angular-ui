/* globals process, exports, require */

exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  capabilities: {
    'browserName': 'chrome'
  },
  specs: [
    'htmlTests.js'
  ],

  onPrepare: require('./onprepare'),
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};
