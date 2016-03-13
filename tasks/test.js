'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');
var execSync        = require('child_process').execSync;

module.exports = function(gulp) {
  gulp.task('test:unit', function() {
    return runUnitTest();
  });

  gulp.task('test:unit:xvfb', function() {
    return startXvfb()
      .then(runUnitTest)
      .then(stopXvfb)
      .catch(function(e) {
        stopXvfb();
        return Promise.reject(e);
      });
  });

  gulp.task('test:unit:docker', function() {
    return new Promise(function(resolve, reject) {
      let cwd = process.cwd();
      try {
        let command = `docker run -v ${cwd}:${cwd} -w ${cwd} ` +
          `jeroenknoops/docker-node-chrome-xvfb ` +
          `node_modules/.bin/gulp test:unit:xvfb`;
        execSync(command, {stdio: [0,1,2]});
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  gulp.task('test:ci', seq('depcheck', 'lint', 'test:unit:docker'));
};

function runUnitTest() {
  return new Promise(function(resolve, reject) {
    new Server({
      configFile: path.resolve(__dirname, '..', 'test', 'karma.conf.js')
    }, function(err) {
      if (err) {
        return reject();
      }
      resolve();
    }).start();
  });
}

function startXvfb() {
  return new Promise(function(resolve, reject) {
    try {
      resolve(execSync(`/etc/init.d/xvfb start`, {stdio: [0,1,2]}));
    } catch (e) {
      reject(e);
    }
  });
}

function stopXvfb() {
  try {
    execSync(`/etc/init.d/xvfb stop`, {stdio: [0,1,2]});
  } catch (e) {}
}
