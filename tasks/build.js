'use strict';

module.exports = function(gulp, config) {

  /*========================================
  =            Requiring stuffs            =
  ========================================*/

  let concat            = require('gulp-concat');
  let connect           = require('gulp-connect');
  let csso              = require('gulp-csso');
  let del               = require('del');
  let less              = require('gulp-less');
  let mobilizer         = require('gulp-mobilizer');
  let path              = require('path');
  let rename            = require('gulp-rename');
  let os                = require('os');
  let seq               = require('run-sequence');
  let sourcemaps        = require('gulp-sourcemaps');
  let uglify            = require('gulp-uglify');

  /*================================================
  =            Report Errors to Console            =
  ================================================*/

  gulp.on('error', function(e) {
    throw(e);
  });

  /*=========================================
  =            Clean dest folder            =
  =========================================*/

  gulp.task('clean', function(cb) {
    del(['dist/**'], cb);
  });

  /*==========================================
  =            Web servers                   =
  ==========================================*/

  gulp.task('connect', function() {
    connect.server({
      host: '0.0.0.0',
      port: 3000,
      livereload: true
    });
  });

  gulp.task('connect:test', function() {
    var server       = require('./test/server');
    var serveFavicon = require('serve-favicon');
    var favicon      = serveFavicon(__dirname + '/test/favicon.ico');

    connect.server({
      host: '0.0.0.0',
      port: 3001,
      middleware: function() {
        return [server, favicon];
      }
    });
  });

  /*==============================================================
  =            Setup live reloading on source changes            =
  ==============================================================*/

  gulp.task('livereload:demo', function() {
    return gulp.src(config.globs.livereloadDemo)
      .pipe(connect.reload());
  });

  gulp.task('livereload:test', function() {
    return gulp.src(config.globs.livereloadTest)
      .pipe(connect.reload());
  });

  gulp.task('livereload:test:manual', function() {
    return gulp.src(config.globs.livereloadTestManual)
      .pipe(connect.reload());
  });

  gulp.task('livereload:test:migrate', function() {
    return gulp.src(config.globs.livereloadTestMigrate)
      .pipe(connect.reload());
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
      'src/less/mobile-angular-ui-migrate.less',
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
      path.join(CSS_TEMP_DIR, 'mobile-angular-ui-migrate.css'),
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

  gulp.task('js:migrate',  function() {
    return compileJs('mobile-angular-ui.migrate.js', config.globs.migrate);
  });

  gulp.task('js:gestures',  function() {
    return compileJs('mobile-angular-ui.gestures.js', config.globs.gestures);
  });

  gulp.task('js:main',  function() {
    return compileJs('mobile-angular-ui.js', config.globs.main);
  });

  gulp.task('js', ['js:main', 'js:gestures', 'js:migrate', 'js:core']);

  /*===================================================================
  =            Watch for source changes and rebuild/reload            =
  ===================================================================*/

  gulp.task('watch', function() {
    gulp.watch(config.globs.livereloadDemo.concat('dist/**/*'), ['livereload:demo']);
    gulp.watch(config.globs.livereloadTest.concat('dist/**/*'), ['livereload:test']);
    gulp.watch(config.globs.livereloadTestManual.concat('dist/**/*'), ['livereload:test:manual']);
    gulp.watch(config.globs.livereloadTestMigrate.concat('dist/**/*'), ['livereload:test:migrate']);

    gulp.watch(['./src/less/**/*'], ['css']);

    ['core', 'gestures', 'migrate', 'main'].forEach(function(target) {
      gulp.watch(config.globs[target], ['js:' + target]);
    });

    gulp.watch(config.globs.fonts, ['fonts']);
  });

  /*======================================
  =            Build Sequence            =
  ======================================*/

  gulp.task('build', function(done) {
    seq('clean', ['fonts', 'css',  'js'], done);
  });

  /*====================================
  =            Default Task            =
  ====================================*/

  gulp.task('default', function(done) {
    var tasks = [];

    tasks.push('connect');
    tasks.push('watch');

    seq('build', tasks, done);
  });

};
