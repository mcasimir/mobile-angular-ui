var app = angular.module('MobileAngularUiExamples', ["mobile-angular-ui", "ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',          {templateUrl: "home.html"});
  $routeProvider.when('/scroll',    {templateUrl: "scroll.html"}); 
  $routeProvider.when('/toggle',    {templateUrl: "toggle.html"}); 
  $routeProvider.when('/tabs',      {templateUrl: "tabs.html"}); 
  $routeProvider.when('/accordion', {templateUrl: "accordion.html"}); 
  $routeProvider.when('/overlay',   {templateUrl: "overlay.html"}); 
  $routeProvider.when('/forms',     {templateUrl: "forms.html"});
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

var escapeHtml = function(str) {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return str.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};

app.directive('exampleCode', function(){
  return {
    link: function(scope, elem, attrs) {
      container = angular.element(document.getElementById(attrs.exampleCode));
      html = container.html();
      elem.empty().append("<pre><code>" + escapeHtml(html) + "</code></pre>")
    }
  };
});

app.controller('MainController', function($rootScope){

});