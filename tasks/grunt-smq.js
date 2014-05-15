var cssParse, cssStringify, fs, parameterize, path, util;

util = require('util');

parameterize = require('parameterize');

fs = require("fs");

path = require('path');

cssParse = require('css-parse');

cssStringify = require('css-stringify');

module.exports = function(grunt) {
  return grunt.task.registerMultiTask("smq", "Split Css by Media Queries", function() {
    var config, dest, files;
    config = this.data;
    files = grunt.file.expand({
      cwd: config.cwd || "."
    }, config.src);
    dest = config.dest || ".";
    try {
      grunt.file.mkdir(dest);
    } catch (_error) {}
    return files.forEach(function(src) {
      var css, destFile, filename, i, ifile, medias, name, nameroot, ofile, rule, rules, stylesheet, tree, _i, _name, _ref, _results;
      nameroot = config.basename || path.basename(src, path.extname(src));
      ifile = path.resolve(config.cwd || ".", src);
      ofile = path.resolve(dest, nameroot + "-base.css");
      css = fs.readFileSync(ifile).toString();
      tree = cssParse(css);
      rules = tree.stylesheet.rules || [];
      medias = {};
      for (i = _i = _ref = rules.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
        rule = rules[i];
        if (rule.type === "media") {
          if (medias[_name = rule.media] == null) {
            medias[_name] = [];
          }
          (rule.rules || []).forEach(function(r) {
            return medias[rule.media].unshift(r);
          });
          rules.splice(i, 1);
        }
      }
      fs.writeFileSync(ofile, cssStringify(tree));
      for (name in medias) {
        rules = medias[name];
        filename = parameterize(name);
        destFile = path.resolve(dest, nameroot + "-" + filename + ".css");
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
        };
        fs.writeFileSync(destFile, cssStringify(stylesheet));
      }
    });
  });
};
