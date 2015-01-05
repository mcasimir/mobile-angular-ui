/* global module: true */

var through = require('./through');

//    vinylFile = require('./vinylFile');

// function yfm(obj) {
//   var res = '---\n';
//   for(var k in obj) {
//     if (obj.hasOwnProperty(k)) {
//       res += k + ': ' + JSON.stringify(obj[k]) + '\n';
//     }
//   }
//   res += '---\n\n';
//   return res;
// }

// function yfmContents(obj, contents) {
//   return yfm(obj) + contents;
// }

module.exports = function() {
  return through(function(obj, enc, done) {
  
  if (obj.type !== 'docgenTree' && obj.path) {
    this.push(obj);
    return done();
  }

  var root = obj.tree;

  // for (var i = 0; i < doclets.length; i++) {
  //   var doclet = doclets[i];
  //   if (doclet.kind === 'module') {
  //     this.push(
  //       vinylFile(
  //         path.join('modules', doclet.name + '.md'), 
  //         yfmContents({title: doclet.name, dockind: doclet.kind}, doclet.description)
  //       )
  //     );
  //   }
  // }

    done();
  });

};