$(document).ready(function(){
  console.log('jquery working');

  $.get("https://skyffel.herokuapp.com/snow", function(data){
    console.log(data);
    $('#snow').text(data);
  })

  $('.login').click(function(){
    console.log('login clicked');
    $.ajax({
      type: 'POST',
      url: 'https://skyffel.herokuapp.com/auth/login',
      data: {name: 'Derik', password: 'abc'},
    }).done(function(result){
      console.log(result.token)
      localStorage.token = result.token;
      getSecret();
    })
  })


function getSecret() {
  $.ajax({
    type: 'GET',
    url: 'https://skyffel.herokuapp.com/secret',
    headers: {
      Authorization: 'Bearer' + localStorage.token
    }
  }).done(function(result){
    console.log(result)
  })
}








})
