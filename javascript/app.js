var app = angular.module('skyffel', ['ngRoute', 'angularMoment', 'ngSanitize'])

app.run(function($http) {
  if(localStorage.token){
    $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.token;
  }
 });


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
  })
  .when('/map', {
    templateUrl: 'partials/map.html',
    controller: 'MapController'
  })
  .when('/dashboard', {
    templateUrl: 'partials/dashboard.html',
    controller: 'DashboardController'
  })
  .when('/shovelboard',{
    templateUrl: 'partials/shovelboard.html',
    controller: 'ShovelboardController'
  })
  .when('/pay/:jobID', {
    templateUrl: 'partials/pay.html',
    controller: 'PayController'
  })
  .otherwise({
    redirectTo: '/login'
  })
})
