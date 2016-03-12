'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');

module.exports = function(gulp) {
  gulp.task('test:unit', function(done) {
    new Server({
      configFile: path.resolve(__dirname, '..', 'test', 'karma.conf.js')
    }, done).start();
  });

  gulp.task('test:ci', seq('depcheck', 'lint', 'test:unit'));
};
