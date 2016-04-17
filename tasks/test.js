'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');
var gutil           = require('gulp-util');
var dns             = require('dns');
var protractor      = require('gulp-protractor').protractor;
var connect         = require('gulp-connect');

module.exports = function(gulp) {
  gulp.task('test:unit', function() {
    if (process.env.CI) {
      return reacheable(
        'chrome.maui-test-net',
        'karma.maui-test-net'
      ).then(runUnitTest);
    } else {
      return runUnitTest();
    }
  });

  gulp.task('test:e2e', function() {
    connect.server({
      root: process.cwd(),
      host: '0.0.0.0',
      port: 8888
    });

    return gulp.src(['./test/e2e/*.spec.js'])
     .pipe(protractor({
       configFile: 'test/protractor.conf.js'
     }))
     .on('error', function() {
       connect.serverClose();
     })
     .on('end', function() {
       connect.serverClose();
     });
  });

  gulp.task('test:ci', seq('depcheck', 'lint', 'test:unit', 'test:e2e'));
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
