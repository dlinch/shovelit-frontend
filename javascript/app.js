var app = angular.module('skyffel', ['ngRoute'])

app.config(function($routeProvider){
  $routeProvider.when('/', {
    templateUrl: 'partials/home.html'
  })
})
