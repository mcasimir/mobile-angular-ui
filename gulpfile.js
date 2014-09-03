var config = {
  dest: 'dist',
  demo: 'demo',
  vendor: {
    js: [
      'bower_components/overthrow/src/overthrow-detect.js', 
      'bower_components/overthrow/src/overthrow-init.js', 
      'bower_components/overthrow/src/overthrow-polyfill.js', 
      'bower_components/fastclick/lib/fastclick.js'
    ],
    fonts: [
      'bower_components/font-awesome/fonts/fontawesome-webfont.*'
    ]
  },
  breakpoints: {
    'screen_xs_min': '480px',
    'screen_sm_min': '768px',
    'screen_md_min': '992px',
    'screen_lg_min': '1200px',
    'screen_xs_max': '767px',
    'screen_sm_max': '991px',
    'screen_md_max': '1199px'
  }
};

var path           = require('path'),
    gulp           = require('gulp'),

    // utils
    seq            = require('run-sequence'),
    streamqueue    = require('streamqueue'),
    order          = require('gulp-order'),
    rename         = require('gulp-rename'),

    // clean
    rimraf         = require('gulp-rimraf'),

    // css
    less           = require('gulp-less'),
    cssmin         = require('gulp-cssmin'),
    mobilizer      = require('gulp-mobilizer'),
    
    // js    
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    ngFilesort     = require('gulp-angular-filesort'),
    jshint         = require('gulp-jshint'),
    ngAnnotate     = require('gulp-ng-annotate'),

    // demo
    connect        = require('gulp-connect');

/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('err', function(e) {
  console.log(e.err.stack);
});

/*============================
=            Dist            =
=============================*/

gulp.task(
  'dist:clean', 
  function(){
    return gulp.src(
      config.dest, 
      { read: false })
        .pipe(rimraf());
  });

gulp.task(
  'dist:fonts',
  function(){
    return gulp.src(config.vendor.fonts)
      .pipe(gulp.dest(path.join(config.dest, 'fonts')));
  });

gulp.task(
  'dist:css', 
  function(){
    var lessStream = gulp.src(
        ['./src/less/mobile-angular-ui.less', 
         './src/less/mobile-angular-ui-desktop.less'])
          .pipe(less({
            paths: [ 
                path.resolve(__dirname, 'src/less'), 
                path.resolve(__dirname, 'bower_components') 
              ]
          }));

    return streamqueue({ objectMode: true },
          lessStream
          .pipe(mobilizer('mobile-angular-ui.css', {
            'mobile-angular-ui-base.css': { 
              hover: 'exclude', 
              screens: [
                '0px', 
                config.breakpoints.screen_xs_min,
                config.breakpoints.screen_sm_min
              ]
            }
          }))
          .pipe(mobilizer('mobile-angular-ui-desktop.css', {
            'mobile-angular-ui-desktop.css': { hover: 'exclude', 
            screens: [ 
              config.breakpoints.screen_md_min,
              config.breakpoints.screen_lg_min
            ]
          }
          }))
        ,
          lessStream
          .pipe(mobilizer('mobile-angular-ui.css', {
            'mobile-angular-ui-hover.css': { hover: 'only', 
            screens: [
              '0px', 
              config.breakpoints.screen_xs_min,
              config.breakpoints.screen_sm_min
            ]}
          }))
          .pipe(mobilizer('mobile-angular-ui-desktop.css', {
            'mobile-angular-ui-desktop-hover.css': { hover: 'only', 
            screens: [ 
              config.breakpoints.screen_md_min,
              config.breakpoints.screen_lg_min
            ]
          }
          }))
          .pipe(concat('mobile-angular-ui-hover.css'))
        )
        .pipe(
          gulp.dest(
            path.join('dist', 'css')
          ))

        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))

        .pipe(
          gulp.dest(
            path.join('dist', 'css')
          ));
  });

gulp.task(
  'dist:js',
  function(){
    return streamqueue({ objectMode: true },
        gulp.src(config.vendor.js)
          .pipe(order(config.vendor.js)),
        gulp.src('./src/js/**/*.js')
          .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(jshint.reporter('fail'))
          .pipe(ngFilesort())
      )
      .pipe(concat('mobile-angular-ui.js'))
      .pipe(gulp.dest(path.join('dist', 'js')))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(path.join('dist', 'js')));
  });

gulp.task('dist:watch', function(){
   gulp.watch(['./src/less/**/*'], ['dist:css']);
   gulp.watch(['./src/js/**/*'], ['dist:js']);
});

gulp.task('dist:build', function(done) {
  seq('dist:clean', ['dist:fonts', 'dist:css', 'dist:js'], done);
});

gulp.task('dist', function(done) {
  seq('dist:build', 'dist:watch', done);
});


/*============================
=            Demo            =
=============================*/

gulp.task('demo:server', function(){
  return connect.server({
    root: [config.demo, '.'],
    host: '0.0.0.0',
    port: 8000,
    livereload: true
  });
});

gulp.task('demo:livereload', function(){
  gulp.src(
      [ 
        path.join(config.demo, '*.html'),
        path.join(config.dest, '**/*'),
      ]
    )
    .pipe(connect.reload());
});

gulp.task('demo:watch', function(){
  gulp.watch([ 
        path.join(config.demo, '*.html'),
        path.join(config.dest, '**/*'),
      ], ['demo:livereload']);
});

gulp.task('demo', function(done) {
  seq(['demo:server', 'demo:watch'], done);
});

/*===============================
=            Default            =
================================*/

gulp.task('default', function(done){  
  seq('dist:build', ['dist:watch', 'demo'], done);
});

/*===============================
=            Release            =
================================*/

gulp.task('release:pre', function(){});
gulp.task('release:patch', function(){});
gulp.task('release:minor', function(){});
gulp.task('release:major', function(){});

