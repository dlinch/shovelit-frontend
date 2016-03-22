var app = angular.module('skyffel', ['ngRoute'])

app.run(function($http) {
   $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.token;
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
  .otherwise({
    redirectTo: '/'
  })
})
