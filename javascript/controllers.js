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
  $scope.waiting = true;
  $http.get('https://skyffel.herokuapp.com/jobs/myjobs/'+ $scope.userID).then(function(jobs){
    console.log(jobs);
    $scope.jobs = jobs.data;
    $scope.waiting = false;
  })

  $http.get('https://skyffel.herokuapp.com/jobs/completedjobs/'+$scope.userID).then(function(jobs){
    console.log(jobs);
    $scope.jobsToBePaid = jobs.data;
  })

  $scope.job = {};
  $scope.job.type = 'house';

  $scope.jobSubmit = function(){
    // console.log($scope.job)
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
      // $scope.job.editFormBoolean = !$scope.job.editFormBoolean;
    }).catch(function(error){
      console.log(error)
    })
  }
  $scope.editFormBoolean = false;


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

  $scope.showNewJobBool=false;
  $scope.showMyJobsBool=true;
  $scope.showToBePaidBool=false;

  $scope.showNewJob = function(){
    $scope.showNewJobBool=true;
    $scope.showMyJobsBool=false;
    $scope.showToBePaidBool=false;
  }

  $scope.showMyJobs = function(){
    $scope.showNewJobBool=false;
    $scope.showMyJobsBool=true;
    $scope.showToBePaidBool=false;
  }

  $scope.showToBePaid = function(){
    $scope.showNewJobBool=false;
    $scope.showMyJobsBool=false;
    $scope.showToBePaidBool=true;
  }


  $scope.waiting = false;



})







app.controller('ShovelboardController', function($scope, $http){


  $scope.token = atob(localStorage.token.split('.')[1]);
  $scope.token = JSON.parse($scope.token)
  console.log($scope.token.user.id);
  $scope.userID = $scope.token.user.id;

  $scope.waiting = true;
  navigator.geolocation.getCurrentPosition(function(position) {
      $scope.currentLat = position.coords.latitude.toString();
      $scope.currentLong = position.coords.longitude.toString();
      delete $http.defaults.headers.common.Authorization
      $http({
          method: 'GET',
          url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.currentLat+','+$scope.currentLong+'&result_type=postal_code&key='+apikey,
          headers: {
              'Accept': 'application/json, text/javascript, /; q=0.01',
              'Content-Type': 'application/json; charset=utf-8',
          }
      }).success(function(data, status){
        console.log(data.results[0].address_components[0].long_name)
        $scope.location = data.results[0].address_components[0].long_name || 80021;
        $scope.radius = 20;

        $http.get('https://skyffel.herokuapp.com/jobs/available/'+$scope.userID+'/'+$scope.radius+'/'+$scope.location).then(function(jobs){
          console.log(jobs.data)
          $scope.waiting=false;
          if(jobs.data){
            $scope.newJobs = jobs.data;
          }
          // else {
          //   $scope.newJobs = false;
          // }
        })

      })
    })


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

app.controller('PayController', function($scope, $http, $routeParams, $sce){
  $scope.jobID = $routeParams.jobID
  $scope.house = false;
  $scope.lot = false;
  $scope.street = false;

  $http.get('https://skyffel.herokuapp.com/jobs/'+$scope.jobID).then(function(job){
    console.log(job.data)
    if(job.data){
      $scope.job = job.data;
      $scope.actionURLHouse = $sce.trustAsHtml('<form action="https://skyffel.herokuapp.com/stripe/'+$scope.jobID+'" method="POST"><script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_ARP6jqMCyavHoZPG7PlmNkYd" data-amount="1000" data-name="Skyffel" data-description="House Shovel ($10.00)" data-image="/128x128.png" data-locale="auto"></script></form>');
      $scope.actionURLLot = $sce.trustAsHtml('<form action="https://skyffel.herokuapp.com/stripe/'+$scope.jobID+'" method="POST"><script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_ARP6jqMCyavHoZPG7PlmNkYd" data-amount="$50" data-name="Skyffel" data-description="Parking Lot Shovel ($50.00)" data-image="/128x128.png" data-locale="auto"></script></form>');
      $scope.actionURLStreet = $sce.trustAsHtml('<form action="https://skyffel.herokuapp.com/stripe/'+$scope.jobID+'" method="POST"><script src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_ARP6jqMCyavHoZPG7PlmNkYd" data-amount="$100" data-name="Skyffel" data-description="Street Shovel ($100.00)" data-image="/128x128.png" data-locale="auto"></script></form>');
    }
    return job.data
  }).then(function(job){
    if (job.type=="house"){
      $scope.house = true;
    } else if(job.type=="lot"){
      $scope.lot = true;
    } else if(job.type=="street"){
      $scope.street = true;
    }
  })
})
