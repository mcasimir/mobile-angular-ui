/* global module: true, global: true, browser: false, expect: true */

module.exports = function() {

  // ie.
  // 
  // expect(ngInvoke(function($rootScope){
  //  return $rootScope.myVar;
  // })).toEqual(5);
  // 
  var ngInvokeAsIs = function(fn) {
    var script = 'return angular.element(document.querySelector(\'[ng-app]\')).injector().invoke(' + fn.toString() + ');';
    return browser.executeScript(script);
  };

  // ie.
  // 
  // expect(ngInvoke(function($rootScope){
  //  return $rootScope.myVar;
  // })).toEqual(5);
  // 
  // or:
  // 
  // expect(ngInvoke('$rootScope.myVar')).toEqual(5);
  // 
  global.ngInvoke = function(fnOrStr) {
    if (typeof fnOrStr === 'string') {
      var parts = fnOrStr.split('.');
      var svc = parts[0];
      fnOrStr = 'function('+svc+') { return '+ fnOrStr + '; }'; 
    }
    return ngInvokeAsIs(fnOrStr);
  };

  // ie. 
  // 
  // var $rootScope = ngService('$rootscope')
  // 
  // expect($rootScope.prop('myVar')).toEqual(5);
  // expect($rootScope.invoke('myFunc', arg1, arg2)).toEqual(5);
  // 
  global.ngService = function(serviceName) {
    return {
      prop: function(propName) {
        return ngInvokeAsIs('function('+serviceName+') { return '+serviceName+'.' +propName+ '; }');
      },
      invoke: function() {
        var args = Array.prototype.slice.call(arguments, 0, arguments.length);
        var funcName = args.shift();
        args = args.map(function(arg) {
          JSON.stringify(arg);
        }).join(',');
        return ngInvokeAsIs('function('+serviceName+') { return '+ serviceName + '.' +funcName+ '('+args+'); }');
      }
    };
  };

  var oldExpect = global.expect;

  global.expect = function(test) {
    if (typeof test === 'function') {
      return oldExpect(ngInvokeAsIs(test));
    } else {
      return oldExpect(test);
    }
  };

  global.ngExpect = function(test) {
    return oldExpect(global.ngInvoke(test));
  };

  global.expectNoErrors = function() {
    browser.manage().logs().get('browser').then(function(logs) {
      var errors = logs.filter(function(log) { return log.level.value > 900 })
                       .map(function(log) { return log.message; })
                       .join('\n');

      if (errors !== '') { // silence if expectation matches
        expect(errors).toEqual(''); 
      }
    });
  };


  var maxWaitTimeoutMs = 50; // 5secs
   
  /**
   * Custom Jasmine matcher builder that waits for an element to have
   * or not have an html class.
   * @param  {String} expectation The html class name
   * @return {Boolean} Returns the expectation result
   *
   * Uses the following object properties:
   * {ElementFinder} this.actual The element to find
   * Creates the following object properties:
   * {String} this.message The error message to show
   * {Error}  this.spec.lastStackTrace A better stack trace of user's interest
   */
  function toHaveClassFnBuilder(builderTypeBool) {
      return function toHaveClass(clsName) {
          if (clsName == null) throw new Error(
              "Custom matcher toHaveClass needs a class name");
          var customMatcherFnThis = this;
          var elmFinder = customMatcherFnThis.actual;
          if (!elmFinder.element) throw new Error(
              "This custom matcher only works on an actual ElementFinder.");
   
          var driverWaitIterations = 0;
          var lastWebdriverError;
   
          var thisIsNot = this.isNot;
          var testHaveClass = !thisIsNot;
          if (!builderTypeBool) {
              testHaveClass = !testHaveClass;
          }
          var haveOrNot = testHaveClass ? 'have' : 'not to have';
          customMatcherFnThis.message = function message() {
              var msg = (elmFinder.locator().message || elmFinder.locator().toString());
              return "Expected '" + msg + "' to " + haveOrNot + 
                          " class " + clsName + ". "
                     "After " + driverWaitIterations + " driverWaitIterations. " +
                     "Last webdriver error: " + lastWebdriverError;
          };
   
          // This will be picked up by elgalu/jasminewd#jasmine_retry
          customMatcherFnThis.spec.lastStackTrace = new Error('Custom Matcher');
          function haveClassOrNotError(err) {
              lastWebdriverError = err.toString();
              return false;
          };
          
          return browser.driver.wait(function() {
              driverWaitIterations++;
              return elmFinder.getAttribute('class').
              then(function getAttributeClass(classes) {
                  var hasClass = classes.split(' ').indexOf(clsName) !== -1;
                  if (testHaveClass) {
                      lastWebdriverError = 'class present:' + hasClass;
                      return hasClass;
                  } else {
                      lastWebdriverError = 'class absent:' + !hasClass;
                      return !hasClass;
                  }
              }, haveClassOrNotError);
          }, maxWaitTimeoutMs).
          then(function(waitResult) {
              if (thisIsNot) {
                  // Jasmine 1.3.1 expects to fail on negation
                  return !waitResult;
              } else {
                  return waitResult;
              }
          }, function(err) {
              // Jasmine 1.3.1 expects to fail on negation
              return thisIsNot;
          });
      };
  };
   
  // Add the custom matchers to jasmine
  beforeEach(function() {
      this.addMatchers({
          toHaveClass:     toHaveClassFnBuilder(true),
          toNotHaveClass:  toHaveClassFnBuilder(false),
      });
  });
};