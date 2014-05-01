exec = require("child_process").exec

module.exports = (grunt) ->
  run = (cmd, callback) ->
    grunt.log.writeln "Executing: " + cmd.blue
    cp = exec(cmd, (err, stdout, stderr) ->
      if err
        grunt.fail.warn err
        callback err
        return
      callback(false, stdout)
    )
    cp.stdout.pipe process.stdout

  grunt.task.registerTask "site-guard", "Run site guard command", ->
    taskDone = @async()
    run "cd site && guard", ->
      taskDone()