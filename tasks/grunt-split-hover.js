var cssParse, cssStringify, fs, parameterize, path, util;

util = require('util');

parameterize = require('parameterize');

fs = require("fs");

path = require('path');

cssParse = require('css-parse');

cssStringify = require('css-stringify');

module.exports = function(grunt) {
  return grunt.task.registerMultiTask("split-hover", "Collect and remove :hover rules from css", function() {
    var config = this.data;
    var files = grunt.file.expand({
          cwd: config.cwd || "."
        }, config.src);

    var dest = config.dest;

    if (!dest) {
      throw(new Error('config.dest not set'));
    }

    files.forEach(function(src) {
      var nameroot = config.basename || path.basename(src, path.extname(src));
      var ifile = path.resolve(config.cwd || ".", src);
      var ofile = path.resolve(dest);
      var css = fs.readFileSync(ifile).toString();
      var tree = cssParse(css);
      var rules = tree.stylesheet.rules || [];

      var hoverStylesheet = {
        type: "stylesheet",
        stylesheet: {
          rules: []
        }
      };
      var hoverRules = hoverStylesheet.stylesheet.rules;

      // NOTE: This wont catch :hover selectors inside media queries, but this is ok for mobile angular ui, since
      // at this point mobile.css should be free from media queries.

      rules.forEach(function(rule){
        if (rule.type === 'rule') {
          var hoverSelectors = [];

          rule.selectors = rule.selectors.filter(function(selector){
            var isHoverSelector = selector.match(/\:hover/);
            if (isHoverSelector) {
              hoverSelectors.push(selector);
              return false;
            } else {
              return true;
            }
          });

          if (hoverSelectors.length) {
            // create a rule with these selectors
            hoverRules.push({
              type: 'rule',
              selectors: hoverSelectors,
              declarations: rule.declarations
            });
          }
        }
      });

      // deletes roules that only had :hover selectors thus having empty selectors now
      tree.stylesheet.rules = tree.stylesheet.rules.filter(function(rule){
        return rule.type != 'rule' || (!! rule.selectors.length);
      });

      fs.writeFileSync(ifile, cssStringify(tree));
      fs.writeFileSync(ofile, cssStringify(hoverStylesheet));
    });
  });
};
