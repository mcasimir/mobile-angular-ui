describe('$transform', function() {

  var getElementTextById = function(id) {
    return element(by.id(id)).getText();
  };

  it('should apply translation like browser rendering engine', function() {
    browser.get('/gestures/transform.html');
    getElementTextById('translate3d-orig-matrix').then(function(origMatrix) {
      expect(getElementTextById('translate3d-comp-matrix')).toEqual(origMatrix);  
    });
  });

  it('should apply rotation like browser rendering engine', function() {
    browser.get('/gestures/transform.html');
    getElementTextById('rotate3d-orig-matrix').then(function(origMatrix) {
      expect(getElementTextById('rotate3d-comp-matrix')).toEqual(origMatrix);  
    });
  });

  it('should apply scale like browser rendering engine', function() {
    browser.get('/gestures/transform.html');
    getElementTextById('scale3d-orig-matrix').then(function(origMatrix) {
      expect(getElementTextById('scale3d-comp-matrix')).toEqual(origMatrix);  
    });
  });

  it('should apply composite transforms like browser rendering engine', function() {
    browser.get('/gestures/transform.html');
    getElementTextById('rotate3d_translate3d-orig-matrix').then(function(origMatrix) {
      expect(getElementTextById('rotate3d_translate3d-comp-matrix')).toEqual(origMatrix);
    });

    getElementTextById('scale3d_rotate3d_translate3d-orig-matrix').then(function(origMatrix) {
      expect(getElementTextById('scale3d_rotate3d_translate3d-comp-matrix')).toEqual(origMatrix);
    });
  });

});