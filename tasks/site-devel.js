var exec;

exec = require("child_process").exec;

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
  
  grunt.task.registerTask("site-guard", "Run site guard command", function() {
    var taskDone;
    taskDone = this.async();
    run("cd site && guard", function() {
      taskDone();
    });
  });
};
