'use strict';

module.exports = function(gulp, config) {

  /*========================================
  =            Requiring stuffs            =
  ========================================*/

  var concat            = require('gulp-concat');
  var csso              = require('gulp-csso');
  var del               = require('del');
  var less              = require('gulp-less');
  var mobilizer         = require('gulp-mobilizer');
  var path              = require('path');
  var rename            = require('gulp-rename');
  var os                = require('os');
  var seq               = require('gulp-sequence');
  var sourcemaps        = require('gulp-sourcemaps');
  var uglify            = require('gulp-uglify');

  /*================================================
  =            Report Errors to Console            =
  ================================================*/

  gulp.on('error', function(e) {
    throw(e);
  });

  /*=========================================
  =            Clean dest folder            =
  =========================================*/

  gulp.task('clean', function() {
    return del(['dist/**']);
  });

  /*==================================
  =            Copy fonts            =
  ==================================*/

  gulp.task('fonts', function() {
    return gulp.src(config.globs.fonts)
    .pipe(gulp.dest(path.join('dist', 'fonts')));
  });

  /*======================================================================
  =            Compile, minify, mobilize less                            =
  ======================================================================*/

  var CSS_TEMP_DIR = path.join(os.tmpdir(), 'mobile-angular-ui', 'css');

  gulp.task('css:less', function() {
    gulp.src([
      'src/less/mobile-angular-ui-base.less',
      'src/less/mobile-angular-ui-desktop.less',
      'src/less/sm-grid.less'
    ])
    .pipe(less({paths: config.globs.vendorLess}))
      .pipe(mobilizer('mobile-angular-ui-base.css', {
        'mobile-angular-ui-base.css': {hover: 'exclude', screens: ['0px']},
        'mobile-angular-ui-hover.css': {hover: 'only', screens: ['0px']}
      }))
      .pipe(gulp.dest(CSS_TEMP_DIR));
  });

  gulp.task('css:concat', function() {
    return gulp.src([
      path.join(CSS_TEMP_DIR, 'sm-grid.css'),
      path.join(CSS_TEMP_DIR, 'mobile-angular-ui-base.css')
    ])
    .pipe(concat('mobile-angular-ui-base.css'))
    .pipe(gulp.dest(path.join('dist', 'css')));
  });

  gulp.task('css:copy', function() {
    return gulp.src([
      path.join(CSS_TEMP_DIR, 'mobile-angular-ui-hover.css'),
      path.join(CSS_TEMP_DIR, 'mobile-angular-ui-desktop.css')
    ])
    .pipe(gulp.dest(path.join('dist', 'css')));
  });

  gulp.task('css:minify', function() {
    return gulp.src(path.join('dist', 'css', '*.css'))
      .pipe(csso())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.join('dist', 'css')));
  });

  gulp.task('css', function(done) {
    seq('css:less', 'css:concat', 'css:copy', 'css:minify', done);
  });

  /*====================================================================
  =            Compile and minify js generating source maps            =
  ====================================================================*/

  var compileJs = function(dest, src) {
    return gulp.src(src)
      .pipe(sourcemaps.init())
      .pipe(concat(dest))
      .pipe(gulp.dest(path.join('dist', 'js')))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join('dist', 'js')));
  };

  gulp.task('js:core',  function() {
    return compileJs('mobile-angular-ui.core.js', config.globs.core);
  });

  gulp.task('js:gestures',  function() {
    return compileJs('mobile-angular-ui.gestures.js', config.globs.gestures);
  });

  gulp.task('js:main',  function() {
    return compileJs('mobile-angular-ui.js', config.globs.main);
  });

  gulp.task('js', ['js:main', 'js:gestures', 'js:core']);

  /*======================================
  =            Build Sequence            =
  ======================================*/

  gulp.task('build', function(done) {
    seq('clean', ['fonts', 'css',  'js'], done);
  });

};
