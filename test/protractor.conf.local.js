'use strict';

exports.config = {
  specs: ['test/e2e/*.js'],
  multiCapabilities: [{
    browserName: 'chrome'
  }],
  directConnect: true,
  baseUrl: 'http://localhost:8888/test/e2e/app'
};
