'use strict';

let protractor        = require('gulp-protractor').protractor;
let ngrok             = require('ngrok');
let connect           = require('gulp-connect');

module.exports = function(gulp) {
  var nullTunnel = function(cb) {
    cb(null, 'http://localhost:3001');
  };

  var ngRockTunnel = function(cb) {
    ngrok.connect({port: 3001}, cb);
  };

  function makeTestTask(name, conf, args, tunnel) {
    var tunnelWrapper = tunnel ? ngRockTunnel : nullTunnel;

    var protractorArgs = args || []
      .concat(process.argv.length > 2 ? process.argv.slice(3, process.argv.length) : []);

    gulp.task(name, ['jshint', 'connect:test'], function(done) {

      var finalize = function() {
        try {
          connect.serverClose();
          if (tunnel) {
            ngrok.disconnect();
          }
        } catch (e) {
          console.error('Errors occurred while shutting down test runtime.', e);
        }
      };

      var testDone = function() {
        finalize();
        done();
      };

      var testErr = function() {
        process.exit(1);
      };

      tunnelWrapper(function(err, url) {
        gulp.src('use_config_specs')
            .pipe(protractor({
              configFile: conf,
              args: ['--baseUrl', url].concat(protractorArgs)
            }))
            .on('end', testDone)
            .on('error', testErr);
      });

    });

  }

  makeTestTask('test', 'test/phantomjs.conf.js');
  makeTestTask('test:run_for_ci', 'test/ci.conf.js', [], true);
  makeTestTask('test:chrome', 'test/chrome.conf.js');
  makeTestTask('test:firefox', 'test/firefox.conf.js');
  makeTestTask('test:iphone', 'test/iphone5.conf.js');

  gulp.task('test:ci', ['depcheck', 'lint', 'test:run_for_ci']);
};
