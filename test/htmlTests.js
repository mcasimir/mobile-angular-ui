/* global console: false, __dirname: false, module: true, process: true */

var glob = require('glob'),
    minimatch = require("minimatch"),
    path = require('path'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    slug = require('slug'),
    tests = {},
    testFiles = glob.sync(path.resolve(__dirname, '**/*.test.html'));

function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

function testToModule(test) {
  var src = [
  'module.exports = function() {',
    test.describes.map(function(d) {
      return 'describe(' + JSON.stringify(d) + ', function(){'; 
    }).join(''),
    'it(' + JSON.stringify(test.spec) + ', function(){',
    'browser.get(' + JSON.stringify(test.browserLoad) + ');',
    test.func,
    test.canThrow ? '' : ';expectNoErrors();',
    '});',
    test.describes.map(function() {
      return '});'; 
    }).join(''),
  '};'
  ].join('');
  return requireFromString(src, test.filename);
}

var tests = {};

function addTest(test) {
  tests[test.describes.join('/') + (test.id ? '/' + test.id : '')] = testToModule(test);
}

function traverse($, node, down, up) {
  down(node);
  var children = node.children();
  children.each(function() {
    traverse($, $(this), down, up);
  });
  up(node);
}

function parseTests(file) {
  var browserLoad = '/' + path.relative(__dirname, file).replace(/\.test\.html$/, '');
  var html = fs.readFileSync(file).toString();
  var $ = cheerio.load(html, {decodeEntities: false});
  var describes = [];

  var downFn = function(node) {
    if (node.attr('describe')) {
      describes.push(node.attr('describe'));
    }
    if (node.attr('type') === 'application/protractor') {
      var spec = node.attr('spec');

      if (!spec || spec.trim() === '') {
        throw new Error('Parsing `'+ file +'`: script[type=\'application/protractor\'] requires `spec` attribute to be set.');
      }

      var func = node.text();
      var prev = html.slice(0, html.indexOf(func));
      func = prev.replace(/[^\n]/g, ' ') + func; // very weird trick to retain lineno and col;

      var canThrow = node.attr('can-throw') === '' || node.attr('can-throw') === 'true';

      addTest({
        describes: describes.slice(0, describes.length), 
        id: node.attr('id') || slug(spec).toLowerCase(),
        spec: spec,
        filename: file,
        browserLoad: browserLoad,
        func: func,
        element: node,
        canThrow: canThrow
      });
    }
  };

  var upFn = function(node) {
    if (node.attr('describe')) {
      describes.pop();
    }
  };

  traverse($, $.root(), downFn, upFn);
}

for (var i = 0; i < testFiles.length; i++) {
  var abs = testFiles[i];
  parseTests(abs);
}

// 
// Parse args
// 
var index = process.argv.indexOf('--tests');
var pattern = index !== -1 && process.argv[index + 1];

// 
// run all tests
//
var testsToRun = [];
var testNames = Object.keys(tests);
testNames.forEach(function(name) {
  if (!pattern || minimatch(name, pattern)) {
    testsToRun.push(tests[name]);
  }
});

if (testNames.length && !testsToRun.length && pattern) {
  console.warn('No tests matched `' + pattern + '`');
  console.log('Available tests:');
  testNames.forEach(function(name) {
    console.log(' - ' + name);
  });
}

testsToRun.forEach(function(fn) {
  fn();
});