/* global module: true, process: false */

var through = require('./through'),
    path   = require('path'),
    _      = require('lodash');

function normalizeModuleNames(doclets) {

  var i, doclet, oldname, names = {};

  // rename modules to have the complete namespace
  for (i = 0; i < doclets.length; i++) {
    doclet = doclets[i];
    if (doclet.kind === 'module') {
      oldname = doclet.name; 
      doclet.name = doclet.longname.replace('module:', '');
      names[oldname] = doclet.name;
    }
  }

  // replace reference to modules:
  for (i = 0; i < doclets.length; i++) {
    doclet = doclets[i];
    if (doclet.kind !== 'module') {
      doclet.longname = doclet.longname.replace(
        /^module\:'?([A-z]+)/g, 
        function(part, moduleName){
          return '' + names[moduleName];
        });
    }
    if (doclet.memberof) {
      doclet.memberof = doclet.memberof.replace(
        /^module\:'?([A-z]+)/g, 
        function(part, moduleName){
          return '' + names[moduleName];
        });
    }
  }

  // get rid of '
  for (i = 0; i < doclets.length; i++) {
    doclet = doclets[i];
    oldname = doclet.name; 
    doclet.name = doclet.name.replace(/'/g, '').replace('module:', '');
    doclet.longname = doclet.longname.replace(/'/g, '').replace('module:', '');
    if (doclet.memberof) {
      doclet.memberof = doclet.memberof.replace(/'/g, '').replace('module:', '');
    }
  }

  return doclets;
}

function normalizeDoclet(doclet, doclets) {
  var parent;
  if (doclet.memberof) {
    var parentByLongname = _.find(doclets, {longname: doclet.memberof}),
        parentDoclet = parentByLongname || _.find(doclets, {name: doclet.memberof});
    if (parentDoclet) {
      parent = parentDoclet.longname;
    } else {
      throw(new Error('Unable to find parent doclet \'' + doclet.memberof + '\' for \'' + doclet.longname + '\''));
    }
  }

  return _.merge(_.omit(doclet, ['ngdoc', 'comment', 'meta', 'longname', 'scope', 'files']),
  {
    name: doclet.name.replace(/^'|'$/g, ''),
    id: doclet.longname,
    kind: doclet.ngdoc || doclet.kind,
    memberof: parent,
    description: doclet.description || '',
    file: path.join(path.relative(process.cwd(), doclet.meta.path), doclet.meta.filename)
  });
}

module.exports = function() {
  return through(function(obj, enc, done) {

    if (obj.type !== 'docgenJsdoc') {
       this.push(obj);
       return done();
     }

    var doclets = obj.doclets;
    var normalizedDoclets;

    try {
      normalizedDoclets = normalizeModuleNames(doclets)
      .map(function(doclet) {
        return normalizeDoclet(doclet, doclets);
      });
    } catch(e) {
      this.emit('error', e);
      done(e);
    }

    this.push({ type: 'docgenDoclets', doclets: normalizedDoclets });
    done();

  });
};