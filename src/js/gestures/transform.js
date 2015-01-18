/**
@module mobile-angular-ui.gestures.transform
@description

`mobile-angular-ui.gestures.transform` provides the `$transform` service is designed 
with the specific aim to provide a cross-browser way to interpolate CSS 3d transform 
without having to deal with CSS Matrix, and being able to take into account any previous
unknown transform already applied to an element.

## Usage

Require this module doing either

``` js
angular.module('myApp', ['mobile-angular-ui.gestures']);
```

Or standalone

``` js
angular.module('myApp', ['mobile-angular-ui.gestures.transform']);
```

Say we have an element with applyed css: 

``` html
<div class='myelem'></div>
```

``` css
.myelem {
  transform: translate(12px) rotate(20deg);
}
```

Then you can use `$transform` like this:

``` js
  t = $transform.get(e);
  t.rotationZ += 15;
  t.translateX += 1;
  $transform.set(e, t);
```

### `$transform` service API

#### `$transform.fromCssMatrix(cssMatrixString) -> transform`

Returns a decomposition of the transform matrix `cssMatrixString`. 
NOTE: 2d matrices are translated to 3d matrices before any other operation.

#### `$transform.toCss(decomposedTransform)`

Recompose a css string from `decomposedTransform`. 

Transforms are recomposed as a composition of:

``` css
matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, perspective[0], perspective[1], perspective[2], perspective[3])
translate3d(translation[0], translation[1], translation[2])
rotateX(rotation[0]) rotateY(rotation[1]) rotateZ(rotation[2])
matrix3d(1,0,0,0, 0,1,0,0, 0,skew[2],1,0, 0,0,0,1)
matrix3d(1,0,0,0, 0,1,0,0, skew[1],0,1,0, 0,0,0,1)
matrix3d(1,0,0,0, skew[0],1,0,0, 0,0,1,0, 0,0,0,1)
scale3d(scale[0], scale[1], scale[2])
```

#### `$transform.get(e) -> transform`

Returns a decomposition of the transform matrix applied to `e`.

#### `$transform.set(element, transform)`

If transform is a string just set it for element `element`. Otherwise is considered as a
decomposed transform and is recomposed with `$transform.toCss` and then set to element.

### The decomposed transform object

Result of transform matrix decomposition is an object with the following properties:

```
translateX
translateY
translateZ
perspectiveX
perspectiveY
perspectiveZ
perspectiveW
scaleX
scaleY
scaleZ
rotateX
rotateY
rotateZ
skewXY
skewXZ
skewYZ
``` 

*/
(function() {
  'use strict';
  
  var module = angular.module('mobile-angular-ui.gestures.transform', []);

  module.factory('$transform', function(){

    /*==============================================================
    =            Cross-Browser Property Prefix Handling            =
    ==============================================================*/

    // Cross-Browser style properties
    var cssPrefix,
        transformProperty,
        styleProperty,
        prefixes = ['', 'webkit', 'Moz', 'O', 'ms'],
        d = document.createElement('div');
    
    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      if ( (prefix + 'Perspective') in d.style ) {
        cssPrefix = (prefix === '' ? '' : '-' + prefix.toLowerCase() + '-');
        styleProperty = prefix + (prefix === '' ? 'transform' : 'Transform');
        transformProperty = cssPrefix + 'transform';
        break;
      }
    }

    d = null;

    // return current element transform matrix in a cross-browser way
    var getElementTransformProperty = function(e) {
      e = e.length ? e[0] : e;
      var tr = window
              .getComputedStyle(e, null)
              .getPropertyValue(transformProperty);
      return tr;
    };

    // set current element transform matrix in a cross-browser way
    var setElementTransformProperty = function(elem, value) {
      elem = elem.length ? elem[0] : elem;
      elem.style[styleProperty] = value;
    };

    /*======================================================
    =            Transform Matrix Decomposition            =
    ======================================================*/

    var SMALL_NUMBER = 1.e-7;

    var rad2deg = function(angle) {
      return angle * 180 / Math.PI;
    };

    var sqrt = Math.sqrt,
        asin = Math.asin,
        atan2 = Math.atan2,
        cos = Math.cos,
        abs = Math.abs,
        floor = Math.floor;

    var cloneMatrix = function(m) {
      var res = [[],[],[],[]];
      for (var i = 0; i < m.length; i++) {
        for (var j = 0; j < m[i].length; j++) {
          res[i][j] = m[i][j];
        }
      }
      return res;
    };

    var determinant2x2 = function(a, b, c, d) {
       return a * d - b * c;
    };

    var determinant3x3 = function(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
      return a1 * determinant2x2(b2, b3, c2, c3) - b1 * determinant2x2(a2, a3, c2, c3) + c1 * determinant2x2(a2, a3, b2, b3);  
    };

    var determinant4x4 = function(m) {
      var a1 = m[0][0], b1 = m[0][1], c1 = m[0][2], d1 = m[0][3], a2 = m[1][0], b2 = m[1][1], c2 = m[1][2], d2 = m[1][3], a3 = m[2][0], b3 = m[2][1], c3 = m[2][2], d3 = m[2][3], a4 = m[3][0], b4 = m[3][1], c4 = m[3][2], d4 = m[3][3];
      return a1 * determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4) - b1 * determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4) + c1 * determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4) - d1 * determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
    };

    var adjoint = function(m) {
      var res = [[],[],[],[]], a1 = m[0][0], b1 = m[0][1], c1 = m[0][2], d1 = m[0][3], a2 = m[1][0], b2 = m[1][1], c2 = m[1][2], d2 = m[1][3], a3 = m[2][0], b3 = m[2][1], c3 = m[2][2], d3 = m[2][3], a4 = m[3][0], b4 = m[3][1], c4 = m[3][2], d4 = m[3][3];

      res[0][0]  =   determinant3x3(b2, b3, b4, c2, c3, c4, d2, d3, d4);
      res[1][0]  = - determinant3x3(a2, a3, a4, c2, c3, c4, d2, d3, d4);
      res[2][0]  =   determinant3x3(a2, a3, a4, b2, b3, b4, d2, d3, d4);
      res[3][0]  = - determinant3x3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
      res[0][1]  = - determinant3x3(b1, b3, b4, c1, c3, c4, d1, d3, d4);
      res[1][1]  =   determinant3x3(a1, a3, a4, c1, c3, c4, d1, d3, d4);
      res[2][1]  = - determinant3x3(a1, a3, a4, b1, b3, b4, d1, d3, d4);
      res[3][1]  =   determinant3x3(a1, a3, a4, b1, b3, b4, c1, c3, c4);
      res[0][2]  =   determinant3x3(b1, b2, b4, c1, c2, c4, d1, d2, d4);
      res[1][2]  = - determinant3x3(a1, a2, a4, c1, c2, c4, d1, d2, d4);
      res[2][2]  =   determinant3x3(a1, a2, a4, b1, b2, b4, d1, d2, d4);
      res[3][2]  = - determinant3x3(a1, a2, a4, b1, b2, b4, c1, c2, c4);
      res[0][3]  = - determinant3x3(b1, b2, b3, c1, c2, c3, d1, d2, d3);
      res[1][3]  =   determinant3x3(a1, a2, a3, c1, c2, c3, d1, d2, d3);
      res[2][3]  = - determinant3x3(a1, a2, a3, b1, b2, b3, d1, d2, d3);
      res[3][3]  =   determinant3x3(a1, a2, a3, b1, b2, b3, c1, c2, c3);

      return res;
    };

    var inverse = function(m) {
      var res = adjoint(m),
          det = determinant4x4(m);
      if (abs(det) < SMALL_NUMBER) { return false; }
      
      for (var i = 0; i < 4; i++) {
          for (var j = 0; j < 4; j++) {
              res[i][j] = res[i][j] / det;
          }
      }
      return res;
    };

    var transposeMatrix4 = function(m) {
      var res = [[],[],[],[]];
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          res[i][j] = m[j][i];
        }
      }
      return res;
    };

    var v4MulPointByMatrix = function(p, m) {
      var res = [];

      res[0] = (p[0] * m[0][0]) + (p[1] * m[1][0]) +
                  (p[2] * m[2][0]) + (p[3] * m[3][0]);
      res[1] = (p[0] * m[0][1]) + (p[1] * m[1][1]) +
                  (p[2] * m[2][1]) + (p[3] * m[3][1]);
      res[2] = (p[0] * m[0][2]) + (p[1] * m[1][2]) +
                  (p[2] * m[2][2]) + (p[3] * m[3][2]);
      res[3] = (p[0] * m[0][3]) + (p[1] * m[1][3]) +
                  (p[2] * m[2][3]) + (p[3] * m[3][3]);

      return res;
    };

    var v3Length = function(a) {
      return sqrt((a[0] * a[0]) + (a[1] * a[1]) + (a[2] * a[2]));
    };

    var v3Scale = function(v, desiredLength) {
      var res = [], len = v3Length(v);
      if (len !== 0) {
          var l = desiredLength / len;
          res[0] *= l;
          res[1] *= l;
          res[2] *= l;
      }
      return res;
    };

    var v3Dot = function(a, b){
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    };

    var v3Combine = function(a, b, ascl, bscl) {
      var res = [];
      res[0] = (ascl * a[0]) + (bscl * b[0]);
      res[1] = (ascl * a[1]) + (bscl * b[1]);
      res[2] = (ascl * a[2]) + (bscl * b[2]);
      return res;
    };

    var v3Cross = function(a, b) {
      var res = [];
      res[0] = (a[1] * b[2]) - (a[2] * b[1]);
      res[1] = (a[2] * b[0]) - (a[0] * b[2]);
      res[2] = (a[0] * b[1]) - (a[1] * b[0]);
      return res;
    };

    var decompose = function(mat) {
      var result = {}, localMatrix = cloneMatrix(mat), i, j;
      
      // Normalize the matrix.
      if (localMatrix[3][3] === 0) {
        return false;
      }

      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          localMatrix[i][j] /= localMatrix[3][3];
        }
      }

      var perspectiveMatrix = cloneMatrix(localMatrix);
      for (i = 0; i < 3; i++) {
        perspectiveMatrix[i][3] = 0;
      }
      perspectiveMatrix[3][3] = 1;

      if (determinant4x4(perspectiveMatrix) === 0) {
        return false;
      }

      // First, isolate perspective.  This is the messiest.
      if (localMatrix[0][3] !== 0 || localMatrix[1][3] !== 0 || localMatrix[2][3] !== 0) {
          // rightHandSide is the right hand side of the equation.
          var rightHandSide = [];
          rightHandSide[0] = localMatrix[0][3];
          rightHandSide[1] = localMatrix[1][3];
          rightHandSide[2] = localMatrix[2][3];
          rightHandSide[3] = localMatrix[3][3];

          // Solve the equation by inverting perspectiveMatrix and multiplying
          // rightHandSide by the inverse. (This is the easiest way, not
          // necessarily the best.)
          var inversePerspectiveMatrix = inverse(perspectiveMatrix);
          var transposedInversePerspectiveMatrix = transposeMatrix4(inversePerspectiveMatrix);
          var perspectivePoint = v4MulPointByMatrix(rightHandSide, transposedInversePerspectiveMatrix);

          result.perspectiveX = perspectivePoint[0];
          result.perspectiveY = perspectivePoint[1];
          result.perspectiveZ = perspectivePoint[2];
          result.perspectiveW = perspectivePoint[3];
          
          // Clear the perspective partition
          localMatrix[0][3] = localMatrix[1][3] = localMatrix[2][3] = 0;
          localMatrix[3][3] = 1;
      } else {
          // No perspective.
          result.perspectiveX = result.perspectiveY = result.perspectiveZ = 0;
          result.perspectiveW = 1;
      }

      // Next take care of translation (easy).
      result.translateX = localMatrix[3][0];
      localMatrix[3][0] = 0;
      result.translateY = localMatrix[3][1];
      localMatrix[3][1] = 0;
      result.translateZ = localMatrix[3][2];
      localMatrix[3][2] = 0;

      // Now get scale and shear.
      var row = [[],[],[]], pdum3;
      
      for (i = 0; i < 3; i++) {
          row[i][0] = localMatrix[i][0];
          row[i][1] = localMatrix[i][1];
          row[i][2] = localMatrix[i][2];
      }

      // Compute X scale factor and normalize first row.
      result.scaleX = v3Length(row[0]);
      v3Scale(row[0], 1.0);

      // Compute XY shear factor and make 2nd row orthogonal to 1st.
      result.skewXY = v3Dot(row[0], row[1]);
      v3Combine(row[1], row[0], row[1], 1.0, -result.skewXY);

      // Now, compute Y scale and normalize 2nd row.
      result.scaleY = v3Length(row[1]);
      v3Scale(row[1], 1.0);
      result.skewXY /= result.scaleY;

      // Compute XZ and YZ shears, orthogonalize 3rd row.
      result.skewXZ = v3Dot(row[0], row[2]);
      v3Combine(row[2], row[0], row[2], 1.0, -result.skewXZ);
      result.skewYZ = v3Dot(row[1], row[2]);
      v3Combine(row[2], row[1], row[2], 1.0, -result.skewYZ);

      // Next, get Z scale and normalize 3rd row.
      result.scaleZ = v3Length(row[2]);
      v3Scale(row[2], 1.0);
      result.skewXZ /= result.scaleZ;
      result.skewYZ /= result.scaleZ;
      
      // At this point, the matrix (in rows[]) is orthonormal.
      // Check for a coordinate system flip.  If the determinant
      // is -1, then negate the matrix and the scaling factors.
      pdum3 = v3Cross(row[1], row[2]);
      
      if (v3Dot(row[0], pdum3) < 0) {
          for (i = 0; i < 3; i++) {
              result.scaleX *= -1;
              row[i][0] *= -1;
              row[i][1] *= -1;
              row[i][2] *= -1;
          }
      }

      // Rotation (angles smaller then SMALL_NUMBER are zeroed)
      result.rotateY = rad2deg(asin(-row[0][2]))  || 0;
      if (cos(result.rotateY) !== 0) {
        result.rotateX = rad2deg(atan2(row[1][2], row[2][2]))  || 0;
        result.rotateZ = rad2deg(atan2(row[0][1], row[0][0]))  || 0;
      } else {
        result.rotateX = rad2deg(atan2(-row[2][0], row[1][1])) || 0;
        result.rotateZ = 0;
      }

      return result;
    };

    /*=========================================
    =            Factory interface            =
    =========================================*/

    var fCom = function(n, def) {
      // avoid scientific notation with toFixed
      var val = (n || def || 0);
      return '' + val.toFixed(20);
    };

    var fPx = function(n, def) {
      return fCom(n, def) + 'px';
    };

    var fDeg = function(n, def) {
      return fCom(n, def) + 'deg';
    };

    return {
      fromCssMatrix: function(tr) {
        var M = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];

        // Just returns identity in case no transform is setup for the element
        if (tr && tr !== 'none') { 
          var elems = tr.split('(')[1].split(')')[0].split(',').map(Number);

          // Is a 2d transform: matrix(a, b, c, d, tx, ty) is a shorthand 
          // for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
          if (tr.match(/^matrix\(/)) {
            M[0][0] = elems[0];
            M[1][0] = elems[1];
            M[0][1] = elems[2];
            M[1][1] = elems[3];
            M[3][0] = elems[4];
            M[3][1] = elems[5];

          // Is a 3d transform, set elements by rows
          } else {
            for (var i = 0; i < 16; i++) {
              var row = floor(i / 4),
                  col = i % 4;
              M[row][col] = elems[i];
            }
          }
        }
        return decompose(M);
      },

      toCss: function(t) {
        // 
        // Transforms are recomposed as a composition of:
        // 
        // matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, perspective[0], perspective[1], perspective[2], perspective[3])
        // translate3d(translation[0], translation[1], translation[2])
        // rotateX(rotation[0]) rotateY(rotation[1]) rotateZ(rotation[2])
        // matrix3d(1,0,0,0, 0,1,0,0, 0,skew[2],1,0, 0,0,0,1)
        // matrix3d(1,0,0,0, 0,1,0,0, skew[1],0,1,0, 0,0,0,1)
        // matrix3d(1,0,0,0, skew[0],1,0,0, 0,0,1,0, 0,0,0,1)
        // scale3d(scale[0], scale[1], scale[2])
        // 
        
        var perspective = [
          fCom(t.perspectiveX),
          fCom(t.perspectiveY),
          fCom(t.perspectiveZ),
          fCom(t.perspectiveW, 1)
        ],
        translate = [
          fPx(t.translateX), 
          fPx(t.translateY), 
          fPx(t.translateZ)
        ],
        scale = [
          fCom(t.scaleX), 
          fCom(t.scaleY),
          fCom(t.scaleZ)
        ],
        rotation = [
          fDeg(t.rotateX),
          fDeg(t.rotateY),
          fDeg(t.rotateZ)
        ],
        skew = [
          fCom(t.skewXY),
          fCom(t.skewXZ),
          fCom(t.skewYZ)
        ];
        
        return [
          'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + perspective.join(',') + ')',
          'translate3d(' + translate.join(',') + ')',
          'rotateX('+ rotation[0] + ') rotateY(' + rotation[1] + ') rotateZ(' + rotation[2] + ')',
          'matrix3d(1,0,0,0,0,1,0,0,0,' + skew[2] + ',1,0,0,0,0,1)',
          'matrix3d(1,0,0,0,0,1,0,0,' + skew[1] + ',0,1,0,0,0,0,1)',
          'matrix3d(1,0,0,0,' + skew[0] + ',1,0,0,0,0,1,0,0,0,0,1)',
          'scale3d(' + scale.join(',') + ')'
        ].join(' ');
      },

      // 
      // Returns a decomposition of the transform matrix applied
      // to `e`;
      //  
      // NOTE: 2d matrices are translated to 3d matrices
      //       before any other operation.
      //       
      get: function(e) {
        return this.fromCssMatrix(getElementTransformProperty(e));
      },

      // Recompose a transform from decomposition `t` and apply it to element `e`
      set: function(e, t) {
        var str = (typeof t === 'string') ? t : this.toCss(t);
        setElementTransformProperty(e, str);  
      }
    };
  });
}());