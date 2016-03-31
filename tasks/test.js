'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');
var execSync        = require('child_process').execSync;
var exec            = require('child_process').exec;
var gutil           = require('gulp-util');

module.exports = function(gulp) {
  gulp.task('test:unit', function() {
    return reacheable(
      'chrome.maui-test-net',
      'karma.maui-test-net'
    ).then(runUnitTest);
  });

  gulp.task('test:unit:docker', function(done) {
    try {
      execSync('docker network create -d bridge maui-test-net');
    } catch (e) {}

    var selenium = exec('docker run --rm ' +
      '--net maui-test-net ' +
      '--net-alias chrome.maui-test-net ' +
      '-v /dev/shm:/dev/shm ' +
      'selenium/standalone-chrome'
    );

    selenium.stdout.pipe(process.stdout);
    selenium.stderr.pipe(process.stderr);

    var karma = exec('docker run --rm ' +
      '--net maui-test-net ' +
      '--net-alias karma.maui-test-net ' +
      '-w /usr/src/app -v ' + process.cwd() + ':/usr/src/app ' +
      'node:5.5.0 ./node_modules/.bin/gulp test:unit'
    );

    karma.stdout.pipe(process.stdout);
    karma.stderr.pipe(process.stderr);

    karma.on('close', function(code) {
      if (code === 0) {
        done();
      } else {
        done(
          new gutil.PluginError({
            plugin: 'test:unit:docker',
            message: `karma container exited with non 0 code.`
          })
        );
      }
      try {
        selenium.kill();
      } catch (e) {
        console.warn(e);
      }
    });
  });

  gulp.task('test:ci', seq('depcheck', 'lint', 'test:unit'));
  gulp.task('test:ci:docker', seq('depcheck', 'lint', 'test:unit:docker'));
};

function reacheableOne(host) {
  return new Promise(function(resolve, reject) {
    require('dns').lookup(host, function(err) {
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
