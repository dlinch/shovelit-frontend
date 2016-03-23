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


app.controller('MapController', function($scope, $http, $routeParams, $sce){
  navigator.geolocation.getCurrentPosition(function(position) {
      $scope.currentLat = position.coords.latitude.toString();
      $scope.currentLong = position.coords.longitude.toString();
      $scope.jobID = $routeParams.jobID
      $http.get('https://skyffel.herokuapp.com/jobs/'+$scope.jobID).then(function(job){
        $scope.jobAddress = job.data.address.split(" ");
        $scope.jobAddress = $scope.jobAddress.join('+')
        $scope.jobAddress = $scope.jobAddress + '+' + job.data.zipcode || 'Denver+CO'
        console.log($scope.jobAddress);
        $scope.latlng= $scope.currentLat+','+$scope.currentLong
    // $scope.map= $sce.trustAsHtml("<iframe width='600' height='450' frameborder='0' style='border:0' ng-src='https://www.google.com/maps/embed/v1/directions?origin=Denver+C0&destination="+$scope.jobAddress+"&key="+apikey+" allowfullscreen></iframe>")
      $scope.map={};
      $scope.map.url="https://www.google.com/maps/embed/v1/directions?origin="+$scope.latlng+"&destination="+$scope.jobAddress+"&key=AIzaSyBNfDygTkW9Qwgwe2TlMtI_CHmeMNCyGh0"
    })

    })

https://www.google.com/maps/embed/v1/directions?&origin=39.7576567-105.00727800000001&destination=1182+Dexter+St.+80205&key=AIzaSyBNfDygTkW9Qwgwe2TlMtI_CHmeMNCyGh0

    $scope.trustSrc= function(src){
      return $sce.trustAsResourceUrl(src);
    }


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
        $scope.location = data.results[0].address_components[0].long_name.blah || 80202;
        $scope.radius = 30;

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

app.controller('PayController', function($scope, $http, $routeParams, $sce, $location){
  $scope.jobID = $routeParams.jobID
  // $scope.house = false;
  // $scope.lot = false;
  // $scope.street = false;


  $http.get('https://skyffel.herokuapp.com/jobs/'+$scope.jobID).then(function(job){
    console.log(job.data)

      if (job.data.type=='house'){
        var handler = StripeCheckout.configure({
      key: 'pk_test_ARP6jqMCyavHoZPG7PlmNkYd',
      image: '/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
        $http({
          method: 'POST',
          url: "https://skyffel.herokuapp.com/stripe/"+$scope.jobID,
          data: {
            stripeToken: token
          }
        }).then(function(){
          $location.url('dashboard')
        }).catch(function(){
          $location.url('dashboard')
        })
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
      }
    });

    handler.open({
      name: 'Skyffel',
      description: '1 House Shovel',
      amount: 1000
    });
      }

      else if (job.data.type=='lot'){
        var handler = StripeCheckout.configure({
        key: 'pk_test_ARP6jqMCyavHoZPG7PlmNkYd',
        image: '/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function(token) {
        $http({
          method: 'POST',
          url: "https://skyffel.herokuapp.com/stripe/"+$scope.jobID,
          data: {
            stripeToken: token
          }
        }).then(function(){
          $location.url('dashboard')
        }).catch(function(){
          $location.url('dashboard')
        })
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
        }
        });


        handler.open({
        name: 'Skyffel',
        description: '1 Lot Shovel',
        amount: 5000
        });

      }

      else if (job.data.type=='street'){
        var handler = StripeCheckout.configure({
      key: 'pk_test_ARP6jqMCyavHoZPG7PlmNkYd',
      image: '/img/documentation/checkout/marketplace.png',
      locale: 'auto',
      token: function(token) {
        $http({
          method: 'POST',
          url: "https://skyffel.herokuapp.com/stripe/"+$scope.jobID,
          data: {
            stripeToken: token
          }
        }).then(function(){
          $location.url('dashboard')
        }).catch(function(){
          $location.url('dashboard')
        })
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
      }
    });

    handler.open({
      name: 'Skyffel',
      description: '1 Street Shovel',
      amount: 10000
    });
    }

    // if(job.data){
    //   $scope.job = job.data;
    //   console.log($scope.job);
    //   $scope.actionURLHouse = $sce.trustAsHtml('<form action="https://skyffel.herokuapp.com/stripe/'+$scope.jobID+'" method="POST"><script ng-src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_ARP6jqMCyavHoZPG7PlmNkYd" data-amount="1000" data-name="Skyffel" data-description="House Shovel ($10.00)" data-image="/128x128.png" data-locale="auto"></script></form>');
    //   $scope.actionURLLot = $sce.trustAsHtml('<form action="https://skyffel.herokuapp.com/stripe/'+$scope.jobID+'" method="POST"><script ng-src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_ARP6jqMCyavHoZPG7PlmNkYd" data-amount="$50" data-name="Skyffel" data-description="Parking Lot Shovel ($50.00)" data-image="/128x128.png" data-locale="auto"></script></form>');
    //   $scope.actionURLStreet = $sce.trustAsHtml('<form action="https://skyffel.herokuapp.com/stripe/'+$scope.jobID+'" method="POST"><script ng-src="https://checkout.stripe.com/checkout.js" class="stripe-button" data-key="pk_test_ARP6jqMCyavHoZPG7PlmNkYd" data-amount="$100" data-name="Skyffel" data-description="Street Shovel ($100.00)" data-image="/128x128.png" data-locale="auto"></script></form>');
    // }

})
  // .then(function(){
  //   if ($scope.job.type=="house"){
  //     $scope.house = true;
  //   } else if($scope.job.type=="lot"){
  //     $scope.lot = true;
  //   } else if($scope.job.type=="street"){
  //     $scope.street = true;
  //   }
  // })
})
