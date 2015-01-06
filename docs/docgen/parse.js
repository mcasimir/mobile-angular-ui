/* global module: true, process: false */

var through = require('./through'),
    path   = require('path'),
    _      = require('lodash'),
    traverse = require('./traverse');

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

  return _.merge(_.omit(doclet, ['ngdoc', 'kind', 'comment', 'meta', 'longname', 'scope', 'files']),
  {
    name: doclet.name.replace(/^'|'$/g, ''),
    id: doclet.longname,
    ngdoc: doclet.ngdoc ? doclet.ngdoc : (doclet.kind === 'module' ? 'module' : undefined),
    type: doclet.kind,
    memberof: parent,
    description: doclet.description || '',
    src: path.join(path.relative(process.cwd(), doclet.meta.path), doclet.meta.filename)
  });
}

function createNodeMap(doclets) {
  var map = {};
  for (var i = 0; i < doclets.length; i++) {
    var item = doclets[i];
    map[item.id] = item;
  }
  return map;
}

function sortChildren(doclets) {
  for (var i = 0; i < doclets.length; i++) {
    var doclet = doclets[i];
    doclets.children = _.sortBy(doclet.children, ['ngdoc', 'name']);
  }
}

function compressParamsTypes(doclets) {
  for (var i = 0; i < doclets.length; i++) {
    var doclet = doclets[i];
    if(doclet.params && _.isArray(doclet.params)) {
      for (var j = 0; j < doclet.params.length; j++) {
        var param = doclet.params[j];
        if (param.type && param.type.names) {
          param.type = param.type.names.join('|');
        } else {
          delete param.type;
        }
      }
    }
  } 
}

function makeTree(doclets) {
  var i;
  for (i = 0; i < doclets.length; i++) {
    var doclet = doclets[i];
    doclet.children = [];
  }

  var nodeMap = createNodeMap(doclets);
  var root = {
    type: 'root',
    children: []
  };

  for (i = 0; i < doclets.length; i++) {
    var doclet = doclets[i];
    doclet.parent = doclet.memberof ? nodeMap[doclet.memberof] : root;
    if (doclet.parent) {
      doclet.parent.children.push(doclet);
    } else if (doclet.memberof) {
      throw(new Error('Unable to find parent doclet \'' + doclet.memberof + '\' for \'' + doclet.id + '\''));
    }

    delete doclet.memberof;
  }

  sortChildren(doclets);
  compressParamsTypes(doclets);

  return root;
}

function normalizeIds(tree) {
  var segments = [];
  traverse(tree, function(node) {
    if (node.type !== 'root') {
      var type = (node.ngdoc || node.type);
      if (type !== 'module') {
        node.path = [segments.join('/'), type + ':' + node.name].join(type.match(/^(event|function|member)$/) ? '#' : '/');  
      } else {
        node.path = segments.join('/') + '/' + node.name;
      }
      segments.push(node.name);
      delete node.id;
    }
  }, function(node) {
    if (node.type !== 'root') {
      segments.pop();
    }
  });
  return tree;
}


function normalizeNames(tree) {
  var modules = [];
  traverse(tree, function(node) {
    if (node.type !== root) {
      var parentModule = modules.join('.');
      if (parentModule !== '') {
        node.module = parentModule;  
      }
      if (node.type === 'module') {
        node.fullname = node.name;
        if (parentModule.length) {
          node.name = node.name.slice(parentModule.length + 1);  
        }
        modules.push(node.name);
      }  else {
        node.fullname = node.name;
      }
    }
  }, function(node) {
    if (node.type === 'module') {
      modules.pop();
    }
  });
  return tree;
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
      this.push({ type: 'docgenDoclets', doclets: _.clone(normalizedDoclets) });
      var tree = makeTree(normalizedDoclets);
      tree = normalizeNames(tree);
      tree = normalizeIds(tree);
      this.push({ type: 'docgenTree', tree: tree });
    } catch(e) {
      this.emit('error', e);
      done(e);
    }
 
    done();
  });
};