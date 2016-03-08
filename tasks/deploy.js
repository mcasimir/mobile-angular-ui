'use strict';

var seq = require('gulp-sequence');
var deploy = require('gulp-gh-pages');

module.exports = function(gulp) {
  gulp.task('_do_deploy', function() {
    return gulp.src('out/**/*')
      .pipe(deploy({remoteUrl: 'git@github.com:mcasimir/mobile-angular-ui.git'}));
  });

  gulp.task('deploy', function(done) {
    seq('build', '_do_deploy', done);
  });
};
