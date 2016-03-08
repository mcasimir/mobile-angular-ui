'use strict';

let path = require('path');

let config = {
  globs: {
    core: [
      'bower_components/fastclick/lib/fastclick.js',
      'src/js/core/**/*.js',
      'src/js/mobile-angular-ui.core.js'
    ],
    components: [
      'bower_components/overthrow/src/overthrow-detect.js',
      'bower_components/overthrow/src/overthrow-init.js',
      'bower_components/overthrow/src/overthrow-polyfill.js',
      'src/js/components/**/*.js',
      'src/js/mobile-angular-ui.components.js'],
    gestures: [
      'src/js/gestures/**/*.js',
      'src/js/mobile-angular-ui.gestures.js'
    ],
    migrate: [
      'src/js/migrate/**/*.js',
      'src/js/mobile-angular-ui.migrate.js'
    ],
    fonts: 'bower_components/font-awesome/fonts/fontawesome-webfont.*',
    vendorLess: [
      path.resolve(__dirname, 'src/less'),
      path.resolve(__dirname, 'bower_components')
    ],
    livereloadDemo: [
      path.join('demo', '*.html')
    ],
    livereloadTest: [
      path.join('test', '**', '*.html')
    ],
    livereloadTestManual: [
      path.join('test', 'manual', '*.html')
    ],
    livereloadTestMigrate: [
      path.join('test', 'migrate', '*.html')
    ],
  },
  lint: ['./src/**/*.js', './test/**/*.js', './*.js']
};

config.globs.main = config.globs.core
  .concat(config.globs.components)
  .concat('src/js/mobile-angular-ui.js');

module.exports = config;
