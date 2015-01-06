// ie.
// 
// var traverse = require('./traverse');
// 
// var root = { name: 'R'
//   children: [
//     { name: 'A', 
//       children: [ {name: 'B1'}, {name: 'B2'}]  }, 
//     { name: 'C' }
//   ]
// };
// 
// traverse(root, function(n){ console.log('down', n.name) }, 
//                function(n){ console.log('up', n.name) });
//                
// ->
// down R
//   down A
//     down B1
//     up B1
//     down B2
//     up B2
//   up A
//   down C
//   up C
// up R

module.exports = function traverse(node, down, up) {
  if (down) {
    down(node);
  }
  var children = node.children || [];
  children.forEach(function(child) {
    traverse(child, down, up);
  });
  if (up) {
    up(node);  
  }
};

