var app = angular.module('AngularUiMobileExamples', ["mobile-angular-ui", "ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {templateUrl: "sink.html"});
  $routeProvider.when('/scroll', {templateUrl: "scroll.html"}); 
  $routeProvider.when('/toggle', {templateUrl: "toggle.html"}); 
  $routeProvider.when('/tabs', {templateUrl: "tabs.html"}); 
  $routeProvider.when('/accordion', {templateUrl: "accordion.html"}); 
  $routeProvider.when('/overlay', {templateUrl: "overlay.html"}); 
  $routeProvider.when('/forms', {templateUrl: "forms.html"});
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

app.controller('MainController', function($rootScope){

});