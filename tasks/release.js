//
// eg. grunt prerelease --msg='Added carousels;'
//

var exec, path, semver;

exec = require("child_process").exec;

path = require("path");

semver = require("semver");

module.exports = function(grunt) {
  var run;
  
  run = function(cmd, callback) {
    var cp;
    grunt.log.writeln("Executing: " + cmd.blue);
    cp = exec(cmd, function(err, stdout, stderr) {
      if (err) {
        grunt.fail.warn(err);
        callback(err);
        return;
      }
      callback(false, stdout);
    });
    cp.stdout.pipe(process.stdout);
  };

  ["major", "minor", "patch", "prerelease"].forEach(function(verType) {
    return grunt.task.registerTask(verType, "Commit and release a new version", function() {
      var message, nextver, taskDone;
      taskDone = this.async();
      message = grunt.option("msg");
      if (!message) {
        grunt.fail.warn("Commit message can't be blank");
        taskDone;
      }
      nextver = null;
      return run("git tag", function(err, out) {
        var latest, sortedTags, tags;
        if (!err) {
          tags = out.split("\n").filter(function(tag) {
            return semver.valid(tag);
          });
          sortedTags = tags.sort(function(t1, t2) {
            return semver.rcompare(t1, t2);
          });
          latest = sortedTags[0];
          nextver = semver.inc(latest, verType);
          console.log("Latest:", latest);
          console.log("Next:", nextver);
          return run("git add .", function(err, out) {
            if (err) {
              return taskDone();
            } else {
              return run("git commit -m \"" + message + "\" -a", function(err, out) {
                if (err) {
                  return taskDone();
                } else {
                  return run("git push", function(err, out) {
                    if (err) {
                      return taskDone();
                    } else {
                      return run("git tag -a " + nextver + " -m \"" + message + "\"", function(err, out) {
                        if (err) {
                          return taskDone();
                        } else {
                          return run("git push --tags", function(err, out) {
                            return taskDone();
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
};
