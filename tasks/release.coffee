#
# eg. grunt prerelease --msg='Added carousels;'
#

exec = require("child_process").exec
path = require("path")
semver = require("semver")

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
  

  ["major", "minor", "patch", "prerelease"].forEach (verType) ->
    grunt.task.registerTask verType, "Commit and release a new version", ->
      taskDone = @async()
      message = grunt.option("msg")

      if not message
        grunt.fail.warn "Commit message can't be blank"
        taskDone
      
      nextver = null

      run "git tag", (err, out) ->
        if !err
          tags = out.split("\n").filter (tag) ->
            semver.valid(tag)

          sortedTags = tags.sort (t1, t2) ->
            semver.rcompare(t1, t2)

          latest = sortedTags[0]
          nextver = semver.inc(latest, verType)

          console.log "Latest:", latest
          console.log "Next:", nextver

          run "git add .", (err, out) ->
            if err
              taskDone()
            else
              run "git commit -m \"#{message}\" -a", (err, out) ->
                if err
                  taskDone()
                else
                  run "git push", (err, out) ->
                    if err
                      taskDone()
                    else
                      run "git tag -a #{nextver} -m \"#{message}\"", (err, out) ->
                        if err
                          taskDone()
                        else
                          run "git push --tags", (err, out) ->
                            taskDone()
