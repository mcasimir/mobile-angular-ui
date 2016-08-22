'use strict';

var path            = require('path');
var Server          = require('karma').Server;
var seq             = require('gulp-sequence');
var gutil           = require('gulp-util');
var protractor      = require('gulp-protractor').protractor;
var connect         = require('gulp-connect');

module.exports = function(gulp) {
  gulp.task('test:unit', function() {
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
  });

  gulp.task('test:e2e', function(done) {
    connect.server({
      root: process.cwd(),
      host: '0.0.0.0',
      port: 8888
    });

    gulp.src(['./test/e2e/*.spec.js'])
     .pipe(protractor({
       configFile: 'test/protractor.conf.js'
     }))
     .on('error', function(err) {
       connect.serverClose();
       done(err);
     })
     .on('end', function() {
       connect.serverClose();
       done();
     });
  });

  gulp.task('test:ci', seq(
    'depcheck',
    'lint',
    'test:unit',
    'test:e2e'
  ));
};
