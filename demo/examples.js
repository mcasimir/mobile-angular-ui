var app = angular.module('MobileAngularUiExamples', [
  "ngRoute",
  "mobile-angular-ui",
  "mobile-angular-ui.touch",
  "mobile-angular-ui.scrollable"
]);

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

app.controller('MainController', function($rootScope, $scope){
  $scope.userAgent =  navigator.userAgent;
  $scope.chatUsers = [
    { name: "Carlos  Flowers", online: true },
    { name: "Byron Taylor", online: true },
    { name: "Jana  Terry", online: true },
    { name: "Darryl  Stone", online: true },
    { name: "Fannie  Carlson", online: true },
    { name: "Holly Nguyen", online: true },
    { name: "Bill  Chavez", online: true },
    { name: "Veronica  Maxwell", online: true },
    { name: "Jessica Webster", online: true },
    { name: "Jackie  Barton", online: true },
    { name: "Crystal Drake", online: false },
    { name: "Milton  Dean", online: false },
    { name: "Joann Johnston", online: false },
    { name: "Cora  Vaughn", online: false },
    { name: "Nina  Briggs", online: false },
    { name: "Casey Turner", online: false },
    { name: "Jimmie  Wilson", online: false },
    { name: "Nathaniel Steele", online: false },
    { name: "Aubrey  Cole", online: false },
    { name: "Donnie  Summers", online: false },
    { name: "Kate  Myers", online: false },
    { name: "Priscilla Hawkins", online: false },
    { name: "Joe Barker", online: false },
    { name: "Lee Norman", online: false },
    { name: "Ebony Rice", online: false }
  ]

});