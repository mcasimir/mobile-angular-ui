path = require("path")
kexec = require("kexec")

#   CSS workflow:
#
#   2) create a combined css with Bootstrap, Fontawesome and Angular Ui Mobile sources
#   3) split complete css
#      into different files 
#      according to media queries
#    
#   4) copy combined and partials files minified and unminified to dist
#   
module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    smq: # Split Css by Media Queries
      bootstrap:
        src:  "tmp/complete.css"
        dest: "dist/css"
        basename: "mobile-angular-ui"

    clean: ["tmp", "dist", "examples/assets"]
    copy:
      fa:
        expand: true, 
        cwd: "bower_components/font-awesome/fonts", 
        src: ["**"], 
        dest: 'dist/fonts'

      examples:
        expand: true,
        cwd: "dist/"
        src: ["**"],
        dest: "examples/assets"

    recess:
      dist:
        options:
          compile: true
          includePath: ["bower_components/bootstrap/less"]

        files:
          "tmp/complete.css": [
            "bower_components/font-awesome/css/font-awesome.css",
            "src/less/mobile-angular-ui.less"
          ]

    coffee:
      compile:
        options:
          bare: true
        files:
          "tmp/mobile-angular-ui.js": [
            "src/coffee/directives/**/*.coffee"
            "src/coffee/mobile-angular-ui.coffee"
          ]

    concat:
      js:
        files: 
          "dist/js/mobile-angular-ui.js": [
            "bower_components/overthrow/src/overthrow-detect.js"
            "bower_components/overthrow/src/overthrow-toss.js"
            "bower_components/overthrow/src/overthrow-polyfill.js"
            "bower_components/angular/angular.js"
            "bower_components/angular-route/angular-route.js"
            "bower_components/angular-animate/angular-animate.js"
            "bower_components/angular-touch/angular-touch.js"
            "tmp/mobile-angular-ui.js"
          ]

    uglify:
      minify:
        options:
          report: 'min'
        files: 
          "dist/js/mobile-angular-ui.min.js": ["dist/js/mobile-angular-ui.js"]

    cssmin:
      minify:
        options:
          report: 'min'
        expand: true
        cwd: 'dist/css/'
        src: ['*.css', '!*.min.css']
        dest: 'dist/css/'
        ext: '.min.css'

    watch:
      all:
        files: "src/**/*"
        tasks: ["build"]

    connect:
      server:
        options:
          port: 3000
          base: 'examples'
          keepalive: true

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-cssmin"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-recess"

  grunt.task.loadTasks "tasks"

  grunt.registerTask "build", [ "clean"
                                "recess"
                                "smq"
                                "coffee"
                                "concat"
                                "copy"
                              ]

  grunt.registerTask "minify",  [ "build"
                                  "uglify"
                                  "cssmin"
                                ]

  grunt.registerTask "git", "", ->
    done = grunt.task.current.async()
    kexec 'git add . && git commit -a && git push'

  grunt.registerTask "commit",  [ "minify",
                                  "git"
                                ]
