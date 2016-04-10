'use strict';

var connect           = require('gulp-connect');
var seq               = require('gulp-sequence');

module.exports = function(gulp, config) {
  gulp.task('dev', function(done) {
    var tasks = [];

    tasks.push('connect');
    tasks.push('watch');

    seq('build', tasks, done);
  });

  /*==========================================
  =            Web servers                   =
  ==========================================*/

  gulp.task('connect', function() {
    connect.server({
      root: process.cwd(),
      host: '0.0.0.0',
      port: 3000,
      livereload: true
    });
  });

  /*==============================================================
  =            Setup live reloading on source changes            =
  ==============================================================*/

  gulp.task('livereload:demo', function() {
    return gulp.src(config.globs.livereloadDemo)
      .pipe(connect.reload());
  });

  /*===================================================================
  =            Watch for source changes and rebuild/reload            =
  ===================================================================*/

  gulp.task('watch', function() {
    gulp.watch(config.globs.livereloadDemo.concat('dist/**/*'), ['livereload:demo']);
    gulp.watch(['./src/less/**/*'], ['css']);

    ['core', 'gestures', 'main'].forEach(function(target) {
      gulp.watch(config.globs[target], ['js:' + target]);
    });

    gulp.watch(config.globs.fonts, ['fonts']);
  });
};
