var app = angular.module('skyffel', ['ngRoute'])

app.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController'
  })
  .when('/token/:token', {
    templateUrl: 'partials/token.html',
    controller: 'TokenController'
  })
  .when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  }).when('/map', {
    templateUrl: 'partials/map.html',
    controller: 'MapController'
  })
  .otherwise({
    redirectTo: '/'
  })
})
