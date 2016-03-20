$(document).ready(function(){
  console.log('jquery working');

  $.get("https://localhost:3000/snow", function(data){
    console.log(data);
    $('#snow').text(data);
  })
})
