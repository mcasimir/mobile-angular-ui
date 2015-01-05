/* global module: true */

var stream = require('stream');

module.exports = function through(transformFn, flushFn) {
  var transformStream = new stream.Transform( { objectMode: true } );
  transformStream._transform = transformFn;
  if (flushFn) {
    transformStream._flush = flushFn;  
  }
  return transformStream;
};
