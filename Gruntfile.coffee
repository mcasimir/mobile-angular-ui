#   CSS workflow:
#
#   2) create a combined css with Bootstrap, Fontawesome and Mobile Angular UI sources
#   3) split mobile css
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
        src:  "tmp/mobile.css"
        dest: "dist/css"
        basename: "mobile-angular-ui"

    clean: 
      dev: ["tmp", "dist", "demo/assets"]
      site: ["gh-pages"]
      tmp_gh_pages_git: ["tmp/gh_pages_git"]

    copy:
      desktop:
        expand: true
        cwd:  "tmp/"
        src:  ["mobile-angular-ui-desktop.css"]
        dest: "dist/css"

      fa:
        expand: true, 
        cwd: "bower_components/font-awesome/fonts", 
        src: ["**"], 
        dest: 'dist/fonts'

      demo:
        expand: true,
        cwd: "dist/"
        src: ["**"],
        dest: "demo/assets"

      demo_angular:
        expand: true,
        cwd: "bower_components/angular"
        src: ["angular.js", "angular.min.js"],
        dest: "demo/assets/js"

      demo_angular_route:
        expand: true,
        cwd: "bower_components/angular-route"
        src: ["angular-route.js", "angular-route.min.js"],
        dest: "demo/assets/js"

      backup_gh_pages_git:
        expand: true,
        cwd: "gh-pages/.git"
        src: ["**"],
        dest: "tmp/gh_pages_git"
      
      restore_gh_pages_git:
        expand: true,
        cwd: "tmp/gh_pages_git"
        src: ["**"],
        dest: "gh-pages/.git"

      gh_pages_demo:
        expand: true,
        cwd: "demo/"
        src: ["**"],
        dest: "gh-pages/demo"

      gh_pages_site:
        expand: true,
        cwd: "site/output"
        src: ["**"],
        dest: "gh-pages"

      gh_pages_cname:
        expand: true,
        cwd: "site"
        src: ["CNAME"],
        dest: "gh-pages"


    recess:
      dist:
        options:
          compile: true
          includePath: ["bower_components/bootstrap/less"]

        files:
          "tmp/mobile.css": [
            "bower_components/font-awesome/css/font-awesome.css",
            "src/less/mobile-angular-ui.less"
          ]
          "tmp/mobile-angular-ui-desktop.css": [
            "src/less/mobile-angular-ui-desktop.less"
          ]

    coffee:
      compile:
        options:
          bare: true
        files:
          "tmp/mobile-angular-ui.js": [
            "src/coffee/directives/**/*.coffee"
            "src/coffee/initializers/**/*.coffee"
            "src/coffee/mobile-angular-ui.coffee"
          ]

          "tmp/mobile-angular-ui-scrollable-iscroll.js": [
            "src/coffee/mobile-angular-ui-scrollable-iscroll.coffee"
          ]

          "tmp/mobile-angular-ui-scrollable-overthrow.js": [
            "src/coffee/mobile-angular-ui-scrollable-overthrow.coffee"
          ]

          "tmp/mobile-angular-ui-scrollable-iscroll-lite.js": [
            "src/coffee/mobile-angular-ui-scrollable-iscroll-lite.coffee"
          ]

          "tmp/mobile-angular-ui-touch-fastclick.js": [
            "src/coffee/mobile-angular-ui-touch-fastclick.coffee"
          ]

          "tmp/mobile-angular-ui-touch-ng.js": [
            "src/coffee/mobile-angular-ui-touch-ng.coffee"
          ]

    concat:
      js:
        files: 
          "dist/js/mobile-angular-ui-scrollable-iscroll.js": [
            "bower_components/iscroll/build/iscroll.js"
            "tmp/mobile-angular-ui-scrollable-iscroll.js"
          ]

          "dist/js/mobile-angular-ui-scrollable-iscroll-lite.js": [
            "bower_components/iscroll/build/iscroll-lite.js"
            "tmp/mobile-angular-ui-scrollable-iscroll.js"
          ]

          "dist/js/mobile-angular-ui-scrollable-overthrow.js": [
            "bower_components/overthrow/src/overthrow-detect.js"
            "bower_components/overthrow/src/overthrow-init.js"
            "bower_components/overthrow/src/overthrow-polyfill.js"
            "bower_components/overthrow/src/overthrow-toss.js"
            "tmp/mobile-angular-ui-scrollable-overthrow.js"
          ]

          "dist/js/mobile-angular-ui-touch-fastclick.js": [
            "bower_components/fastclick/lib/fastclick.js"
            "tmp/mobile-angular-ui-touch-fastclick.js"
          ]

          "dist/js/mobile-angular-ui-touch-ng.js": [
            "bower_components/angular-touch/angular-touch.js"
            "tmp/mobile-angular-ui-touch-ng.js"
          ]

          "dist/js/mobile-angular-ui.js": [
            "tmp/mobile-angular-ui.js"
          ]

    uglify:
      minify:
        options:
          report: 'min'
        files: 
          "dist/js/mobile-angular-ui.min.js": ["dist/js/mobile-angular-ui.js"]
          "dist/js/mobile-angular-ui-scrollable-iscroll.min.js": ["dist/js/mobile-angular-ui-scrollable-iscroll.js"]
          "dist/js/mobile-angular-ui-scrollable-iscroll-lite.min.js": ["dist/js/mobile-angular-ui-scrollable-iscroll-lite.js"]
          "dist/js/mobile-angular-ui-scrollable-overthrow.min.js": ["dist/js/mobile-angular-ui-scrollable-overthrow.js"]
          "dist/js/mobile-angular-ui-touch-fastclick.min.js": ["dist/js/mobile-angular-ui-touch-fastclick.js"]
          "dist/js/mobile-angular-ui-touch-ng.min.js": ["dist/js/mobile-angular-ui-touch-ng.js"]


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
          hostname: '0.0.0.0'
          port: 3001
          keepalive: true

    githubPages:
      site:
        options:
          commitMessage: "push"

        src: "gh-pages"

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-cssmin"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-github-pages"
  grunt.loadNpmTasks "grunt-recess"

  grunt.task.loadTasks "tasks"

  grunt.registerTask "build", [ "clean:dev"
                                "recess"
                                "smq"
                                "coffee"
                                "concat"
                                "copy:desktop"
                                "copy:fa"
                                "uglify"
                                "cssmin"
                                "copy:demo"
                                "copy:demo_angular"
                                "copy:demo_angular_route"
                              ]


  grunt.registerTask "site", [ 
      "copy:backup_gh_pages_git"
      "clean:site"
      "copy:restore_gh_pages_git"
      "clean:tmp_gh_pages_git"
      "copy:gh_pages_demo"
      "copy:gh_pages_site"
      "copy:gh_pages_cname"
      "githubPages:site"
    ]

