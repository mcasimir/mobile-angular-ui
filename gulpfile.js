'use strict';

var config        = require('./config');
var gulp          = require('gulp');

require('require-all')({
  dirname:  __dirname + '/tasks',
  resolve:  function(task) { task(gulp, config); }
});
