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

  $http.get('https://skyffel.herokuapp.com/jobs/completedjobs'+$scope.userID).then(function(jobs){
    console.log(jobs);
    $scope.jobsToBePaid = jobs.data;
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

  $scope.updateJob = function(job){
    console.log('update!')
    console.log(job);
    job.zipcode
    $http({
      method: 'PUT',
      url: 'https://skyffel.herokuapp.com/jobs/update/'+ job.id,
      data: {
        zipcode: parseInt(job.zipcode),
        address: job.address,
        property: job.type,
      }
    }).then(function(data){
      console.log(data)
      $scope.editFormBoolean = !$scope.editFormBoolean;
    }).catch(function(error){
      console.log(error)
    })
  }
  $scope.editFormBoolean = false;

  $scope.toggleEdit = function(){
    $scope.editFormBoolean = !$scope.editFormBoolean;
  }

  $scope.deleteJob = function(job){
    $http({
      method: 'DELETE',
      url: 'https://skyffel.herokuapp.com/jobs/delete/'+ job.id,
    }).then(function(data){
      console.log(data)
      var index = $scope.jobs.indexOf(job);
      $scope.jobs.splice(index, 1);
    }).catch(function(data){
      console.log(data);
    })
  }


})

app.controller('ShovelboardController', function($scope, $http){
  $scope.token = atob(localStorage.token.split('.')[1]);
  $scope.token = JSON.parse($scope.token)
  console.log($scope.token.user.id);
  $scope.userID = $scope.token.user.id;

  navigator.geolocation.getCurrentPosition(function(position) {
      $scope.currentLat = position.coords.latitude.toString();
      $scope.currentLong = position.coords.longitude.toString();
      $http({
          method: 'GET',
          url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.currentLat+','+$scope.currentLong+'&key='+apikey,
          headers: {
              'Accept': 'application/json, text/javascript, /; q=0.01',
              'Content-Type': 'application/json; charset=utf-8',
          }
      }).success(function(data, status){
        $scope.location = parseInt(data.results[5].address_components[0].long_name) || 80021;
        $scope.radius = 20;

        console.log(data.results[5].address_components[0].long_name);
        $http.get('https://skyffel.herokuapp.com/jobs/available/'+$scope.userID+'/'+$scope.radius+'/'+$scope.location).then(function(jobs){
          console.log(jobs.data)
          if(jobs.data){
            $scope.newJobs = jobs.data;
          }
          // else {
          //   $scope.newJobs = false;
          // }
        })

      })
    })
    delete $http.defaults.headers.common.Authorization




  $scope.acceptedJobs = [];

  $http.get('https://skyffel.herokuapp.com/jobs/currentjobs/'+$scope.userID).then(function(jobs){
    console.log(jobs.data)
    if(jobs.data){
      $scope.acceptedJobs = jobs.data;
    }
  })
  $scope.acceptJob = function(job){
    $http({
      method: 'PUT',
      url: 'https://skyffel.herokuapp.com/jobs/accept/'+ job.id +'/'+$scope.userID
    }).then(function(data){
      console.log(data);
      $scope.acceptedJobs.push(job)
      var index = $scope.newJobs.indexOf(job);
      $scope.newJobs.splice(index, 1);

    }).catch(function(error){
      console.log(error);
    })
  }

  $scope.completeJob = function(job){
    $http({
      method: 'PUT',
      url: 'https://skyffel.herokuapp.com/jobs/complete/'+ job.id,
    }).then(function(data){
      // SOMETHING THAT TRIGGERS PAYMENT
      var index = $scope.acceptedJobs.indexOf(job);
      $scope.acceptedJobs.splice(index, 1);
    }).catch(function(error){
      console.log(error);
    })
  }

  $scope.unacceptJob = function(job){
    $http({
      method: 'PUT',
      url: 'https://skyffel.herokuapp.com/jobs/unaccept/'+ job.id,
    }).then(function(data){
      console.log(data);
      $scope.newJobs.push(job)
      var index = $scope.acceptedJobs.indexOf(job);
      $scope.acceptedJobs.splice(index, 1);

    })
  }
})
