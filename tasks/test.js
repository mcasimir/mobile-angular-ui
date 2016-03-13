'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');

module.exports = function(gulp) {
  gulp.task('test:unit', function() {
    return runUnitTest();
  });

  gulp.task('test:ci', seq('depcheck', 'lint', 'test:unit'));
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
