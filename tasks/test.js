'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');
var gutil           = require('gulp-util');
var dns             = require('dns');

module.exports = function(gulp) {
  gulp.task('test:unit', function() {
    return reacheable(
      'chrome.maui-test-net',
      'karma.maui-test-net'
    ).then(runUnitTest);
  });

  gulp.task('test:ci', seq('depcheck', 'lint', 'test:unit'));
  gulp.task('test:ci:docker', seq('depcheck', 'lint', 'test:unit:docker'));
};

function reacheableOne(host) {
  return new Promise(function(resolve, reject) {
    dns.lookup(host, function(err) {
      if (err) {
        return reject(new gutil.PluginError({
          plugin: 'test:unit',
          message: `host ${host} is not reacheable.
            It seems you may want to run tests through docker or
            manually setup entries in /etc/hosts or equivalent to
            make them work.`
        }));
      }
      resolve();
    });
  });
}

function reacheable() {
  var hosts = [].slice.call(arguments);
  return Promise.all(hosts.map(function(host) {
    return reacheableOne(host);
  }));
}

function runUnitTest() {
  return new Promise(function(resolve, reject) {
    new Server({
      configFile: path.resolve(__dirname, '..', 'test', 'karma.conf.js')
    }, function(err) {
      if (err) {
        return reject(new gutil.PluginError({
          plugin: 'test:unit',
          message: 'Unit tests failed.'
        }));
      }
      resolve();
    }).start();
  });
}
