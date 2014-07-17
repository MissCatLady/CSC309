$(document).ready(function()  {

  var game2token = window.localStorage.getItem("game2token");

  $.get("/gameinprogress",{game2token:game2token}, function(data) {
  	var formstring = '<div class="label"><h4>Current game in progress:</h4></div><form action="/startgame" method=""><div class="formholder">';
  	var formatstring= '<div class="randompad"><fieldset><input id="game2" type="submit" value="';
  	var inputstring = '';


    if (data) {
 
      	if (game2token==null) {
      		window.localStorage.setItem("game2token",data[1]);
      	} 

      	inputstring = formatstring + data[0] + '"></fieldset></form></div></div>';
      	$('#inprogress').append(formstring+inputstring);  
  	} 





  }); 





});