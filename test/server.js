/* global __dirname: false, module: true, require: true */

'use strict';

var glob = require('glob');
var path = require('path');
var url = require('url');
var fs = require('fs');
var cheerio = require('cheerio');
var layoutHtml = fs.readFileSync(path.resolve(__dirname, 'layout.html'));
var testsDoms  = {};
var testFiles = glob.sync(path.resolve(__dirname, '**/*.test.html'));

for (var i = 0; i < testFiles.length; i++) {
  var abs = testFiles[i];
  var key = path.relative(__dirname, abs).replace(/\.test\.html$/, '');
  testsDoms['/' + key] = cheerio.load(fs.readFileSync(abs), {decodeEntities: false});
}

module.exports = function(req, res, next) {
  var parsedUrl = url.parse(req.url, true);

  var test = testsDoms[parsedUrl.pathname];
  if (!test) { return next(); }

  var layout = cheerio.load(layoutHtml, {decodeEntities: false});

  layout('head').append(test('head').contents().clone());
  layout('body').append(test('body').contents().clone());

  res.write(layout.html());
  res.end();
};
