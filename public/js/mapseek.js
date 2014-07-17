

var map;
var mapOptions = {
    zoom: 16
  };

function getLocation(content) {
  
  map = new google.maps.Map(document.getElementById('map-canvas1'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);


      //use POST to send location information
      sendLocation(position.coords.latitude, position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: content
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

function getAllLocations(coords) {
        var players = window.localStorage.getItem("players").split(",")
        var mycoords = window.localStorage.getItem("mycoords".split(","))
        var infowindow = [];
        var pos;
        var content;
        map = new google.maps.Map(document.getElementById('map-canvas1'),mapOptions);

        for (var i in coords) {
            console.log(coords[i]);
            pos = new google.maps.LatLng(coords[i][0],coords[i][1]);
            if (mycoords[0]==coords[i][0] && mycoords[1]==coords[i][0]) {
              content = "You're hiding here!";
            } else {
              content = players[i] + " is hiding here.";
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
  $.post("/gamecheckin", {latitude:latitude, longitude:longitude}, function(data) {
    if (data) {
      window.localStorage.setItem("mycoords", [latitude, longitude]);
    }
    
  });

 } 

function checkFound(coords) {
  //currently positions can be hacked w. some quick javascript
  //TODO: check mycoords against player coords (coords, and uids are sequence matched)


}

function checkPoints() {
  //query to get everyone's points, see if game has been won
}

function checkLocations() {

  var isseeker = window.localStorage.getItem("isseeker");
  var points = window.localStorage.getItem("points");
  var game2token = window.localStorage.getItem("game2token");
  var playeruid = window.localStorage.getItem("playersuid");
  var coords = [];

  $.get("/friendlocations", {game2token: game2token, playeruid:playeruid}, function(data) {

    for (var i in data) {
      coords.push(data[i]);
    
    }

    if (isseeker == "true") {
      if (checkFound(coords)) {
        window.localStorage.setItem("Points", parseInt(points) + 5);
      } else {
        changeMSG("Hey Seeker! There's nobody here. \n Try somewhere else!");
      }
    } else {
      getAllLocations(coords);
    }
  });
  

}

//initmap
google.maps.event.addDomListener(window, 'load', getLocation("You've checked in here!"));
//quit game
var game2token = window.localStorage.getItem("game2token");
          $('#quit').click(function () {
            $.get("/endgame",{game2token:game2token}, function(data) {
            //clear game related data
            window.localStorage.removeItem("game2token");
            window.localStorage.removeItem("players");
            window.localStorage.removeItem("playersuid");
            window.localStorage.removeItem("isseeker");
            window.localStorage.removeItem("mycoords");
            window.localStorage.removeItem("points");
            window.localStorage.removeItem("mygameid");
            console.log("FINISHED GAME");
            document.location.href = '../games';
              });
  });


$("#refresh").click(function() {
  console.log("clicked refresh");
  checkLocations();
  checkPoints();
  google.maps.event.trigger(map, 'resize');
});

$("#checkin").click(function() {
  console.log("clicked checkin");

});

