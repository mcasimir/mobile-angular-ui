var lodash = require('lodash');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),    
    
    concurrent: {
      devel: {
        tasks: ['connect', 'watch'],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      },
      site: {
        tasks: ['connect', 'site-guard'],
        options: {
          limit: 2,
          logConcurrentOutput: true
        }
      },
      all: {
        tasks: ['connect', 'watch', 'site-guard'],
        options: {
          limit: 3,
          logConcurrentOutput: true
        }
      }
    },
    
    smq: {
      bootstrap: {
        src: "tmp/mobile.css",
        dest: "tmp/sqm",
        basename: "mobile-angular-ui"
      }
    },
    
    clean: {
      dev: ["tmp", "dist", "demo/assets"],
      site: ["gh-pages"],
      site_out: ["site/output"],
      tmp_gh_pages_git: ["tmp/gh_pages_git"]
    },
    
    copy: {
      css_to_dist: {
        expand: true,
        cwd: "tmp/",
        src: ["mobile-angular-ui-desktop.css"],
        dest: "dist/css"
      },
      fa: {
        expand: true,
        cwd: "bower_components/font-awesome/fonts",
        src: ["**"],
        dest: 'dist/fonts'
      },
      backup_gh_pages_git: {
        expand: true,
        cwd: "gh-pages/.git",
        src: ["**"],
        dest: "tmp/gh_pages_git"
      },
      restore_gh_pages_git: {
        expand: true,
        cwd: "tmp/gh_pages_git",
        src: ["**"],
        dest: "gh-pages/.git"
      },
      gh_pages_demo: {
        expand: true,
        cwd: "demo/",
        src: ["**"],
        dest: "gh-pages/demo"
      },
      gh_pages_dist: {
        expand: true,
        cwd: "dist/",
        src: ["**"],
        dest: "gh-pages/dist"
      },
      gh_pages_site: {
        expand: true,
        cwd: "site/output",
        src: ["**"],
        dest: "gh-pages"
      },
      gh_pages_cname: {
        expand: true,
        cwd: "site",
        src: ["CNAME"],
        dest: "gh-pages"
      }
    },
    
    less: {
      dist: {
        options: {
          paths: ["src/less", "bower_components"]
        },
        files: {
          "tmp/mobile.css": "src/less/mobile-angular-ui.less",
          "tmp/sm-grid.css": "src/less/sm-grid.less",
          "tmp/mobile-angular-ui-desktop.css": "src/less/mobile-angular-ui-desktop.less"
        }
      }
    },
    
    concat: {
      css: {
        files: {
          "dist/css/mobile-angular-ui-base.css": ["tmp/sqm/mobile-angular-ui-base.css", "tmp/sm-grid.css"]
        }
      },
      js: {
        files: {
          "dist/js/mobile-angular-ui.js": ["bower_components/overthrow/src/overthrow-detect.js", "bower_components/overthrow/src/overthrow-init.js", "bower_components/overthrow/src/overthrow-polyfill.js", "bower_components/fastclick/lib/fastclick.js", "src/js/lib/*.js", "src/js/mobile-angular-ui.js"]
        }
      }
    },
    
    uglify: {
      minify: {
        options: {
          report: 'min'
        },
        files: {
          "dist/js/mobile-angular-ui.min.js": ["dist/js/mobile-angular-ui.js"]
        }
      }
    },
    
    cssmin: {
      minify: {
        options: {
          report: 'min'
        },
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/',
        ext: '.min.css'
      }
    },
    
    watch: {
      all: {
        files: "src/**/*",
        tasks: ["build"]
      }
    },
    
    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          port: 3000,
          base: ['site/output', '.'],
          keepalive: true
        }
      }
    },
    
    githubPages: {
      site: {
        options: {
          commitMessage: "push"
        },
        src: "gh-pages"
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-github-pages");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.task.loadTasks("tasks");

  grunt.registerTask("build", 
                              [ "clean:dev",
                                "less",
                                "smq",
                                "concat",
                                "copy:css_to_dist",
                                "copy:fa",
                                "uglify",
                                "cssmin"]);

  grunt.registerTask("devel",   
                                [ "build",
                                  "concurrent:devel"]);

  grunt.registerTask("devel-site", 
                                   [ "clean:site_out",
                                     "build",
                                     "concurrent:site"]);
  grunt.registerTask("default", 
                                [ "clean:site_out",
                                  "build",
                                  "concurrent:all"]);

  grunt.registerTask("build-gh-pages", 
                              [ "copy:backup_gh_pages_git",
                                "clean:site",
                                "copy:restore_gh_pages_git",
                                "clean:tmp_gh_pages_git",
                                "copy:gh_pages_site",
                                "copy:gh_pages_cname",
                                "copy:gh_pages_demo",
                                "copy:gh_pages_dist"]);

  grunt.registerTask("push-site",
                                [ "build-gh-pages",
                                  "githubPages:site"]);

};
