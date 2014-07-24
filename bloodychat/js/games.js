$(document).ready(function()  {

  var game2token = window.localStorage.getItem("game2token");


  $.get("/gameinprogress",{game2token:game2token}, function(data) {
  	var formstring = '<div class="label"><h4>Current game in progress:</h4></div><form action="/startgame" method=""><div class="formholder">';
  	var formatstring= '<div class="randompad"><fieldset><input id="game2" type="submit" value="';
  	var inputstring = '';


    if (data) {


        if (data.length > 1) {
            console.log("override");
            //old game is overridden
            window.localStorage.setItem('game2token', data[1]);
            window.localStorage.setItem('playersuid', data[2]);
            window.localStorage.setItem('players', data[3])
            window.localStorage.setItem('isseeker', data[0]);
            window.localStorage.setItem('points', data[5]);
            window.localStorage.setItem('mygameid', data[4]);
        }

        //currently doesn't allow different games in progress
      	inputstring = formatstring + 'Hide & Seek"></fieldset></form></div></div>';
      	$('#inprogress').append(formstring+inputstring);  
  	} 





  }); 

});