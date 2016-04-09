'use strict';

module.exports = function(gulp) {
  require('gulp-release-tasks')(gulp);

  var assertClean = require('git-assert-clean');

  gulp.task('release:check-status', function() {
    return assertClean();
  });

  gulp.task('release', require('gulp-sequence')('release:check-status', 'build', 'test:ci', 'tag', 'changelog:commit'));
};
