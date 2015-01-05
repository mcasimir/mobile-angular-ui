/* global __dirname: false, module: true, process: false */

var stream = require('stream'),
    path   = require('path'),
    spawn  = require('child_process').spawn,
    util   = require('util');

var JSDOC_BIN  = path.resolve(__dirname, '../../node_modules/jsdoc/jsdoc.js'),
    JSDOC_CONF = path.resolve(__dirname, 'jsdoc-conf.json');

function DocletReader(sources) {
  stream.Readable.call( this, { objectMode: true } );
  this.srcDir = sources;
  this.done = false;
}

util.inherits(DocletReader, stream.Readable);

DocletReader.prototype._read = function() {
  if (this.done) { return; }
  
  var self = this,
      sources = path.resolve(process.cwd(), this.srcDir),
      docletsBuff = '',
      child = spawn(JSDOC_BIN, ['-r', sources, '-c', JSDOC_CONF, '-X']);

  child.on('error', function(e) { 
    self.emit('error', e);
  });

  child.stdout.on('data', function(buff) {
    docletsBuff += buff.toString('utf8');
  });

  child.stdout.on('end', function() {
    var doclets = JSON.parse(docletsBuff).filter(function(doclet) {
      return !(doclet.undocumented || doclet.kind === 'package');
    });

    self.done = true;
    self.push({ type: 'docgenJsdoc', doclets: doclets });
    self.push(null);
  });
};

module.exports = function(sources) {
  return new DocletReader(sources);
};