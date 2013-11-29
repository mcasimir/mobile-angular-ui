path = require("path")


#   CSS workflow:
#
#   2) create a combined css with Bootstrap, Fontawesome and Maui sources
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
        basename: "maui"

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

      examples_routes:
        expand: true,
        cwd: "bower_components/angular-route"
        src: ["angular-route.js"],
        dest: "examples/assets/js"

    recess:
      dist:
        options:
          compile: true
          includePath: ["bower_components/bootstrap/less"]

        files:
          "tmp/complete.css": [
            "bower_components/font-awesome/css/font-awesome.css",
            "src/less/maui.less"
          ]

    coffee:
      compile:
        options:
          bare: true
        files:
          "tmp/maui.js": [
            "src/coffee/directives/**/*.coffee"
            "src/coffee/maui.coffee"
          ]

    concat:
      js:
        files: 
          "dist/js/maui.js": [
            "bower_components/overthrow/src/overthrow-detect.js"
            "bower_components/overthrow/src/overthrow-toss.js"
            "bower_components/overthrow/src/overthrow-polyfill.js"
            "bower_components/angular/angular.js"
            "bower_components/angular-animate/angular-animate.js"
            "bower_components/angular-touch/angular-touch.js"
            "bower_components/angular-ui-bootstrap/src/transition/transition.js"
            "bower_components/angular-ui-bootstrap/src/accordion/accordion.js"
            "bower_components/angular-ui-bootstrap/src/collapse/collapse.js"
            "bower_components/angular-ui-bootstrap/src/dropdownToggle/dropdownToggle.js"
            "tmp/maui.js"
          ]

    uglify:
      minify:
        options:
          report: 'min'
        files: 
          "dist/js/maui.min.js": ["dist/js/maui.js"]

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
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-cssmin"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-recess"
  grunt.loadNpmTasks "grunt-shell"
  grunt.loadNpmTasks "grunt-contrib-coffee"

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