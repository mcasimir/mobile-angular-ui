var app = angular.module('MauiExamples', ["maui", "ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {templateUrl: "sink.html"});
  $routeProvider.when('/scroll', {templateUrl: "scroll.html"}); 
  $routeProvider.when('/tabs', {templateUrl: "tabs.html"}); 
});

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

app.controller('MainController', function($scope){

});