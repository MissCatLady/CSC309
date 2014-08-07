// Note: This script requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var templat;
var templong;
//var mapcontent = "Level1: a big treasure lies in the legendary jesse ketchum park, go find it!";
var playerrank=0;
var csrf = $('#csrf').val();
var mapcontent;
function initialize() {
  //get the player rank from previous record
  var csrf = $('#csrf').val();
  $.get("/startscav?_csrf="+csrf,function(data) {
    playerrank = parseInt(data.level);
    //display player's ranking based on his/her level
      if(playerrank==1){
        $("#user_rank").html("<strong>Hello my friend, your current ranking is 1, you are considered as a newbie adventurer</strong>");
        mapcontent = "Level1: a big treasure lies in the legendary jesse ketchum park, go find it!";
        templat = 43.6670302+0.005;
        templong =  -79.3875667-0.005;
      }
      else if(playerrank==2){
        $("#user_rank").html("<strong>Hello my friend, your current ranking is 2, you are considered as a intermediate adventurer</strong>");
        templat = 43.6675;
        templong = -79.3942;
         mapcontent = "Level2: a big treasure lies in the legendary Royal Ontario Museum, go find it!";
      }
      else if(playerrank==3){
        $("#user_rank").html("<strong>Hello my friend, your current ranking is 3, you are considered as a legendary adventurer</strong>");
        templat = 43.6426;
        templong = -79.3871;
         mapcontent = "Level3: a big treasure lies in the legendary CN Tower, go find it!";
      
      }
    setGameMap();
  });
  $("#button-submit").show();
  $("#rules_text").hide();
  $("#ruleshide").hide();
  $("#button-check").hide();
  $("#button-quit").hide();

}

function setGameMap(){

      var mapOptions = {
    zoom: 14
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'This is where you are young adventurer'
      });
  //insert a marker on map

  var aLatlng = new google.maps.LatLng(templat,templong);
  var marker = new google.maps.Marker({
      position: aLatlng,
      map: map,
      title: 'a location'
    });
    
  var infowindow1 = new google.maps.InfoWindow({
        map: map,
        position: aLatlng,
        content: mapcontent
      });
 
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }


}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);

//when user click the start game button, send a get request
document.getElementById("button-submit").onclick=function(){startnewscav()};


function startnewscav(){

  navigator.geolocation.getCurrentPosition(function(position) {
  var csrf = $('#csrf').val();

    $("#button-submit").hide();
    $("#button-quit").show();
    $("#button-check").show();
    var latitude = position.coords.latitude;
    var longitude =position.coords.longitude;





  
 


});

}


function checkgame(){
  //check the status of the game, if the user has reached the destination
  /*
    var csrf = $('#csrf').val();
  $.get("/checkscav?_csrf=" + csrf,function(data){

  });*/
  //alert(playerrank);
  navigator.geolocation.getCurrentPosition(function(position) {

    var distance = Math.pow(templat-position.coords.latitude,2)+Math.pow(templong-position.coords.longitude,2);
    distance = Math.round(distance*10000000);

    //convert the distance into meters
    if(distance>100){
      alert("keep trying young adventurer you are approximately "+(distance+300) +" meters away from getting the treasure");
    }
    else{
      //the player has won the game by finding the treasure
      //update the level 
    playerrank = playerrank+1;
    var csrf = $('#csrf').val();
    alert("congratulation young adventurer, you have found the treasure!");
    $.post("/winscav?_csrf=" + csrf,{rank:playerrank},function(data){

    });
    initialize();
    }

  });

}



function quitgame(){
    $("#button-submit").show();
    $("#button-quit").hide();
    $("#button-check").hide();
//delete the data of user who is playing the game right now

}
//show/hide game rules
function showrule(){
  $("#rules_text").show();
  $("#rules").hide();
  $("#ruleshide").show();
}
function hiderule(){
  $("#rules_text").hide();
  $("#ruleshide").hide();
  $("#rules").show();
}