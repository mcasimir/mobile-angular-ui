'use strict';

module.exports = function(gulp, config) {

  gulp.task('depcheck:require-strict', function() {
    let pkg = require('../package');

    let nonStrictDeps = getNonStrictDeps(pkg.dependencies || {})
      .concat(getNonStrictDeps(pkg.devDependencies || {}));

    if (nonStrictDeps.length) {
      return Promise.reject(new Error(`The following dependencies are not strict:\n${nonStrictDeps.join('\n')}`));
    } else {
      return Promise.resolve();
    }
  });

  gulp.task('depcheck', ['depcheck:require-strict'], require('gulp-depcheck')({
    ignoreDirs: ['client', 'public'],
    ignoreMatches: assetsModules().concat([
      'angular',
      'angular-mocks',
      'bootstrap',
      'mobile-angular-ui'
    ])
  }));

  function assetsModules() {
    return config.globs.js
    .concat(config.globs.fonts)
      .filter(function(path) {
        return path.match(/^node_modules/);
      }).map(function(path) {
        return path.split('/')[1];
      });
  }
};

function getNonStrictDeps(deps) {
  let errors = [];

  Object.keys(deps)
    .forEach(function(depName) {
      let depVersion = deps[depName];
      let url = require('url').parse(depVersion);
      if (url.protocol) {
        depVersion = url.hash && url.hash.replace(/^#v?/, '') || '';
      }
      if (!depVersion[0].match(/[0-9]/)) {
        errors.push(depName);
      }
    });

  return errors;
}
