exports.config = {
  seleniumServerJar: '../node_modules/selenium-standalone-jar/bin/selenium-server-standalone-2.45.0.jar',
  specs: [
    'htmlTests.js'
  ],
  capabilities: {
    browserName: 'phantomjs',
    'phantomjs.binary.path': require('phantomjs').path,
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  },

  onPrepare: require('./onprepare'),
  rootElement: 'body',

  jasmineNodeOpts: { includeStackTrace: true }
};
