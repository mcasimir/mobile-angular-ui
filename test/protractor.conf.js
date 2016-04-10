'use strict';

if (process.env.CI) {
  module.exports = require('./protractor.conf.ci.js');
} else {
  module.exports = require('./protractor.conf.local.js');
}
