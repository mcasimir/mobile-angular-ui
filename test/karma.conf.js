'use strict';

if (process.env.CI) {
  module.exports = require('./karma.conf.ci.js');
} else {
  module.exports = require('./karma.conf.local.js');
}
