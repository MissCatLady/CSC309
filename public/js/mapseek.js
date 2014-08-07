
//this file holds client side game logic and map population

var map;
var mapOptions = {
    zoom: 16
  };

function getLocation(content) {
  var isseeker = window.localStorage.getItem("isseeker");

  map = new google.maps.Map(document.getElementById('map-canvas1'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);


      //use POST to send location information
      sendLocation(position.coords.latitude, position.coords.longitude);

      if (!isseeker) {
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: content
      });
      } else {

        var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos
      });

      }
      map.setCenter(pos);


    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }



}

function getAllLocations(coords) {
    var mycoords = window.localStorage.getItem("mycoords").split(",");
    var myid = window.localStorage.getItem("myid");
    var infowindow = [];
    var pos;
    var content;
    map = new google.maps.Map(document.getElementById('map-canvas1'),mapOptions);

    for (var i in coords) {
        console.log(coords[i]);

        if (mycoords[0]==coords[i].coords[0] && mycoords[1]==coords[i].coords[0]) {
          content = "You're hiding here!";
          pos = new google.maps.LatLng(coords[i].coords[0],coords[i].coords[1]);
        } else {
          if(coords[i].coords[0] != -1){
            if (myid == coords[i].id) {
              content = "You're checked in here";
            } else {
              content = coords[i].username + " is hiding here.";
            }
            pos = new google.maps.LatLng(coords[i].coords[0],coords[i].coords[1]);
          }
        }
        infowindow[i] = new google.maps.InfoWindow({
          map: map,
          position: pos,
          content: content
        });
    }
    map.setCenter(pos);
}

function changeMSG(content) {
   map = new google.maps.Map(document.getElementById('map-canvas1'), mapOptions);
   var coords = window.localStorage.getItem("mycoords").split(",");
   var pos = new google.maps.LatLng(coords[0], coords[1]);

   var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: content
   });
   map.setCenter(pos);
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

function sendLocation(latitude,longitude) {
    var csrf = $('#csrf').val();
    $.post("/gamecheckin?_csrf=" + csrf, {game2token: window.localStorage.getItem("game2token"), latitude:latitude, longitude:longitude}, function(data) {
        if (data) {
            window.localStorage.setItem("mycoords", [latitude, longitude]);
            window.localStorage.setItem("myid", data[1]);
        }
    });
 }

function checkFound(coords) {
    for(var i in coords){
        if(coords[i].found == true){
            var mycoords = window.localStorage.getItem("mycoords").split(",");
            var pos1 = new google.maps.LatLng(coords[i].coords[0],coords[i].coords[1]);
            var pos2 = new google.maps.LatLng(parseFloat(mycoords[0]), parseFloat(mycoords[1]));
            if(google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2) < 50){
                return true;
            }
        }
    }
    return false;
}

function checkLocations() {
    var isseeker = window.localStorage.getItem("isseeker");
    var found = window.localStorage.getItem("found");
    var game2token = window.localStorage.getItem("game2token");
    var coords = [];

    $.get("/friendlocations", {game2token: game2token}, function(data) {
        
        var gameText = "Hiders: ";
        var allfound=true;
        for (var i in data) {
            coords.push(data[i]);
            if(coords[i].found == true){
                gameText += "<del>" + coords[i].username + "</del>| ";
            }else{
                gameText += coords[i].username + "|";
                allfound=false;
            }
        }

        if (coords.length > 0 && allfound) {
          var ok = window.confirm("The seeker has won! Click OK to end the game.");
          if (ok) {
            endGame();
          }
        }

        $("#gametext").html(gameText);

        if (isseeker == "true") {
            if (checkFound(coords)) {
                changeMSG("Found someone here.");
            } else {
                changeMSG("Hey Seeker! There's nobody here. \n Try somewhere else!");
            }
        } else {
            getAllLocations(coords);
        }
    });
}

$("#refresh").click(function() {

    var game2token = window.localStorage.getItem("game2token");
    var csrf = $('#csrf').val();
    $.get("/checkgame?_csrf=" + csrf,{game2token:game2token}, function(data) {

      if (!data) {

        var ok = window.confirm("The game has ended. All players have been found.");
          if (ok) {
            endGame();
        }

      } 

    });

    console.log("clicked refresh");
    getLocation("You've checked in here!")
    checkLocations();
    google.maps.event.trigger(map, 'resize');


});

//initmap
google.maps.event.addDomListener(window, 'load', getLocation("You've checked in here!"));

window.localStorage.setItem("game2token", $("#game_token").val());
window.localStorage.setItem("isseeker", $("#is_seeker").val());

checkLocations();

//quit game
var game2token = window.localStorage.getItem("game2token");
$('#quit').click(function () {
  endGame();
});

function endGame() {
  var csrf = $('#csrf').val();
  $.get("/endgame?_csrf=" + csrf,{game2token:game2token}, function(data) {
    //clear game related data
    window.localStorage.removeItem("game2token");
    window.localStorage.removeItem("isseeker");
    window.localStorage.removeItem("mycoords");
    console.log("FINISHED GAME");
    document.location.href = '../games';
});
}