app.controller('HomeController', function($scope, $http){

})

app.controller('TokenController', function($scope, $http, $routeParams, $location){

  console.log($routeParams.token);
  var token = $routeParams.token
  localStorage.token = token;
  $location.url('/')
})

app.controller('LoginController', function($scope, $http){
  console.log('LoginController')
  $scope.facebook = function(){
    $http.get('https://skyffel.herokuapp.com/auth/facebook').then(function(result){
      console.log(result.data.token);
      localStorage.token = result.data.token;
      getSecret();
    })
  }

  function getSecret() {
    // Set the Authorization header in the call to $http.get
    $http.get('/secret', {
      headers: {
        Authorization: 'Bearer ' + localStorage.token
      }
    }).then(function(result){
      $scope.result = result.data;
    }).catch(function(error){
      console.log(error);
    });
  }
})


app.controller('MapController', function($scope){

})
