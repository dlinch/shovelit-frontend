$(document).ready(function(){
  console.log('jquery working');

  $.get("http://localhost:3000/snow", function(data){
    console.log(data);
    $('#snow').text(data);
  })
})
