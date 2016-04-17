'use strict';

exports.config = {
  specs: ['test/e2e/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }],
  directConnect: true,
  baseUrl: 'http://0.0.0.0:8888/test/e2e/app'
};
