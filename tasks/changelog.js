'use strict';

module.exports = function(gulp) {
  var conventionalChangelog = require('gulp-conventional-changelog');
  var git = require('gulp-git');

  gulp.task('changelog', function() {
    return generateChangeLog();
  });

  gulp.task('changelog:commit', function() {
    return generateChangeLog()
      .then(commitChangelog);
  });

  function generateChangeLog() {
    return new Promise(function(resolve, reject) {
      gulp.src('CHANGELOG.md', {
          buffer: false
        })
          .pipe(conventionalChangelog({
            releaseCount: 0
          }))
          .pipe(gulp.dest('./'))
          .on('error', reject)
          .on('end', resolve);
    });
  }

  function commitChangelog() {
    return new Promise(function(resolve, reject) {
      return gulp.src('./CHANGELOG.md')
        .pipe(git.commit('[ci skip] Update CHANGELOG'))
        .on('error', reject)
        .on('end', function() {
          git.push('origin', 'master', function(err) {
            if (err) { return reject(err); }
            resolve();
          });
        });
    });
  }
};
