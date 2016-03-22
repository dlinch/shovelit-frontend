app.controller('HomeController', function($scope, $http){

})

app.controller('TokenController', function($scope, $http, $routeParams, $location){

  console.log($routeParams.token);
  var token = $routeParams.token
  localStorage.token = token;
  $http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.token;
  $location.url('/dashboard')
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

app.controller('DashboardController', function($scope, $http){

  $scope.token = atob(localStorage.token.split('.')[1]);
  $scope.token = JSON.parse($scope.token)
  console.log($scope.token.user.id);
  $scope.userID = $scope.token.user.id;
  $http.get('https://skyffel.herokuapp.com/jobs/myjobs/'+ $scope.userID).then(function(jobs){
    console.log(jobs);
    $scope.jobs = jobs.data;
  })

  $scope.job = {};
  $scope.job.type = 'house';

  $scope.jobSubmit = function(){
    console.log($scope.job)
    $http({
      method: 'POST',
      url: 'https://skyffel.herokuapp.com/jobs/new/' + $scope.userID,
      data: {
        property: $scope.job.type,
        zipcode: $scope.job.zipcode,
        address: $scope.job.address,
      }
    }).then(function(data){
      $scope.job.id = data.data[0]
      console.log(data)
      $scope.jobs.push($scope.job)
    }).catch(function(error){
      console.log(error)
    })
  }

  $scope.myJobsBoolean = false;
})

app.controller('ShovelboardController', function($scope, $http){
  $http.get('https://skyffel.herokuapp.com/jobs').then(function(jobs){
    $scope.newJobs = jobs.data;
  })
  $scope.acceptJob = function(job){
    console.log(job.address)
  }
})
