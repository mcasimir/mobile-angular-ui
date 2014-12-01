(function() {
  'use strict';
  angular.module('mobile-angular-ui.gestures.transform', [])

  .factory('Transform', [
    '$window',
    function($window){

      function matrixHeight(m) {
        return m.length;
      }

      function matrixWidth(m) {
        return m[0] ? m[0].length : 0;
      }

      function matrixMult(m1, m2) {
        var width1  = matrixWidth(m1), 
            width2  = matrixWidth(m2), 
            height1 = matrixHeight(m1), 
            height2 = matrixHeight(m2);

        if (width1 != height2) {
          throw new Error("error: incompatible sizes");
        }
      
        var result = [];
        for (var i = 0; i < height1; i++) {
            result[i] = [];
            for (var j = 0; j < width2; j++) {
                var sum = 0;
                for (var k = 0; k < width1; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result; 
      }

      //
      // Cross-Browser stuffs
      // 
      var vendorPrefix,
          cssPrefix,
          transformProperty,
          prefixes = ['', 'webkit', 'Moz', 'O', 'ms'],
          d = $window.document.createElement('div');
      
      for (var i = 0; i < prefixes.length; i++) {
        var prefix = prefixes[i];
        if ( (prefix + 'Perspective') in d.style ) {
          vendorPrefix = prefix;
          cssPrefix = (prefix === '' ? '' : '-' + prefix.toLowerCase() + '-');
          transformProperty = cssPrefix + 'transform';
          break;
        }
      }

      d = null;

      //
      // Represents a 2d transform, 
      // behind the scene is a transform matrix exposing methods to get/set
      // meaningfull primitives like rotation, translation and scale.
      // 
      // Allows to apply multiple transforms through #merge.
      //
      function Transform(matrix) {
        this.mtx = matrix || [
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ];
      }
      
      Transform.getElementTransformProperty = function(e) {
        e = e.length ? e[0] : e;
        var tr = $window
                .getComputedStyle(e, null)
                .getPropertyValue(transformProperty);
      };

      Transform.setElementTransformProperty = function(e, value) {
        e = e.length ? e[0] : e;
        e.style[transformProperty] = value;
      };

      Transform.fromElement = function(e) {
        e = e.length ? e[0] : e;
        var tr = $window
                .getComputedStyle(e, null)
                .getPropertyValue(transformProperty);

        if (!tr || tr === 'none') {
          return new Transform();
        }

        if (tr.match('matrix3d')) {
          throw new Error('Handling 3d transform is not supported yet');
        }

        var values = 
          tr.split('(')[1]
            .split(')')[0]
            .split(',')
            .map(Number);

        var mtx = [
          [values[0], values[2], values[4]],
          [values[1], values[3], values[5]],
          [        0,         0,        1 ],
        ];

        return new Transform(mtx);
      };

      Transform.prototype.apply = function(e, options) {
        e = e.length ? e[0] : e;
        var mtx = Transform.fromElement(e).merge(this).mtx;
        e.style[transformProperty] = 'matrix(' + [ mtx[0][0], mtx[1][0], mtx[0][1], mtx[1][1], mtx[0][2], mtx[1][2] ].join(',') + ')';
        return this;
      };

      Transform.prototype.set = function(e) {
        e = e.length ? e[0] : e;
        var mtx = this.mtx;
        e.style[transformProperty] = 'matrix(' + [ mtx[0][0], mtx[1][0], mtx[0][1], mtx[1][1], mtx[0][2], mtx[1][2] ].join(',') + ')';
        return this;
      };

      Transform.prototype.rotate = function(a) {
        a = a * (Math.PI / 180); // deg2rad
        var t = [
          [Math.cos(a), -Math.sin(a),  0],
          [Math.sin(a),  Math.cos(a),  0],
          [          0,            0,  1]
        ];

        this.mtx = matrixMult(t, this.mtx);
        return this;
      };

      Transform.prototype.translate = function(x, y) {
        y = (y === null || y === undefined) ? x : y;
        var t = [
          [1,0,x],
          [0,1,y],
          [0,0,1]
        ];
        this.mtx = matrixMult(t, this.mtx);
        return this;
      };

      Transform.prototype.scale = function(a) {
        var t = [
          [a,0,0],
          [0,a,0],
          [0,0,1]
        ];
        this.mtx = matrixMult(t, this.mtx);
        return this;
      };

      Transform.prototype.merge = function(t) {
        this.mtx = matrixMult(this.mtx, t.mtx);
        return this;
      };

      Transform.prototype.getRotation = function() {
        var mtx = this.mtx;
        return Math.round(Math.atan2(mtx[1][0], mtx[0][0]) * (180/Math.PI)); // rad2deg
      };

      Transform.prototype.getTranslation = function() {
        var mtx = this.mtx;
        return {
          x: mtx[0][2],
          y: mtx[1][2]
        };
      };

      Transform.prototype.getScale = function() {
        var mtx = this.mtx, a = mtx[0][0], b = mtx[1][0], d = 10;
        return Math.round( Math.sqrt( a*a + b*b ) * d ) / d;
      };

      Transform.prototype.matrixToString = function() {
        var mtx = this.mtx;
        var res = "";
        for (var i = 0; i < mtx.length; i++) {
          for (var j = 0; j < mtx[i].length; j++) {
            var n = '' + mtx[i][j];
            res += n;
            for (var k = 0; k < 5 - n.length; k++) {
              res += ' ';
            }
          }
          res += '\n';
        }
        return res;
      };

      return Transform;
    }
  ]);
}());