util =  require 'util'
parameterize = require 'parameterize'

fs =  require "fs"
path =  require 'path'
cssParse =  require 'css-parse'
cssStringify =  require 'css-stringify'

module.exports = (grunt) ->

  grunt.task.registerMultiTask "smq", "Split Css by Media Queries", ->
    config = @data
    files = grunt.file.expand({cwd: (config.cwd or ".")}, config.src)
    dest  = config.dest or "."
    
    try
      grunt.file.mkdir dest

    files.forEach (src) ->

      nameroot = config.basename or path.basename(src, path.extname(src))

      ifile = path.resolve(config.cwd or ".", src)
      ofile = path.resolve(dest, nameroot + ".base.css")
      css = fs.readFileSync( ifile ).toString()
      tree = cssParse(css)
      rules = tree.stylesheet.rules or []

      medias = {}
      for i in [(rules.length-1)..0]
        rule = rules[i]        
        if rule.type is "media"
          medias[rule.media] ?= []
          (rule.rules or []).forEach (r) ->
            medias[rule.media].unshift(r) 

          rules.splice(i, 1)

      # Write basic mobile stylesheet
      fs.writeFileSync ofile, cssStringify(tree)

      # Write media queries stylesheets
      for name, rules of medias
        filename = parameterize name

        destFile = path.resolve(dest, nameroot + "." + filename + ".css")
        stylesheet = {
          type: "stylesheet",
          stylesheet: {
            rules: [
              {
                type: "media",
                media: name,
                rules: rules
              }
            ]
          }
        }

        fs.writeFileSync destFile, cssStringify(stylesheet)