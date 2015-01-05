/* global __dirname: false, module: true */

var path = require('path'),
    doclets = require('./doclets'),
    parse = require('./parse'),
    render = require('./render'),
    debug = require('./debug');

module.exports = function(sources, options) {
  options = options || {};
  return doclets(sources)
         .pipe(debug(options))
         .pipe(parse())
         .pipe(debug(options))
         .pipe(render());
};