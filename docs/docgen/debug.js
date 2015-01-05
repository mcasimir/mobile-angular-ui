/* global module: true */

var through = require('./through'),
    vinylFile = require('./vinylFile'),
    stringify = require('json-stringify-safe'),
    _  = require('lodash');


module.exports = function(options) {
  options = options || {};
  return through(function(obj, enc, done) {

    if(obj.type === 'docgenTree' && options.outputTree) {
      this.push(vinylFile('tree.json', stringify(obj.tree, null, 2)));
    } else if(obj.type === 'docgenDoclets' && options.outputDoclets) {
      this.push(vinylFile('doclets.json', stringify(obj.doclets, null, 2)));
    } else if(obj.type === 'docgenJsdoc' && options.outputJsdoc) {
      this.push(vinylFile('jsdoc.json', stringify(obj.doclets, null, 2)));
    } 
    
    this.push(obj);

    done();

  });
};