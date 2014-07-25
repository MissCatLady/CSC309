// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;

function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(43.6617, -79.3950)
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation

  
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
//Users location
    var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
       content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading"></h1>'+
      '<div id="bodyContent">'+
      'This is your Current Location </p>'+
      '</div>'+
      '</div>',

      });
  var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'http://www.geocodezip.com/mapIcons/small_blue_dot.png',
        animation: google.maps.Animation.DROP,
    });

    google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
    });
    
    var myLatLng = new google.maps.LatLng(43.6617, -79.3950);
    
     var marker2 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow2 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Kings College Circle</h1>'+
      '<div id="bodyContent">'+
      'King’s College Circle is always bustling with activity, including athletics, events and ceremonies steeped in University tradition</p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker2, 'click', function() {
      
      if ( (Math.abs(position.coords.latitude - marker2.getPosition().lat())) < 0.001 ){
    alert("You are at King College Circle, Take a Picture and send it to your freinds");
    marker2.setMap(null);
    }
    else{
    infowindow2.open(map,marker2);
    }
    
  });
  
  
//UOFT
    var myLatLng = new google.maps.LatLng(43.6656, -79.3958);
     var marker3 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow3 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Trinity College</h1>'+
      '<div id="bodyContent">'+
      'Trinity College is a small academic college with a long and illustrious history within the University of Toronto, the largest university in Canada. A small, distinctive college at the heart of a great university</p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker3, 'click', function() {
      
      if ( (Math.abs(position.coords.latitude - marker3.getPosition().lat())) < 0.001 ){
    alert("You are at Trinity College, Take a Picture and send it to your freinds");
    marker3.setMap(null);
    }
    else{
    infowindow3.open(map,marker3);
    }
    
  });
  
  
  
//UOFT
    var myLatLng = new google.maps.LatLng(43.6669, -79.3919);
     var marker4 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow4 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Victoria College</h1>'+
      '<div id="bodyContent">'+
      'Founded in 1836 in Cobourg, Ontario, by royal charter from King William IV, Victoria federated with the University of Toronto in 1890. It comprises Victoria College, an arts and science college of U of T, and Emmanuel College, a theological college associated with the United Church of Canada. </p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker4, 'click', function() {
     
      if ( (Math.abs(position.coords.latitude - marker4.getPosition().lat())) < 0.001 ){
    alert("You are at Victoria College, Take a Picture and send it to your freinds");
    marker4.setMap(null);
    }
    else{
    infowindow4.open(map,marker4);
    }
    
  });
  
//UOFT
    var myLatLng = new google.maps.LatLng(43.6644, -79.3994);
     var marker5 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow5 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Robarts Library</h1>'+
      '<div id="bodyContent">'+
      'The John P. Robarts Research Library, commonly referred to as Robarts Library, is the main humanities and social sciences library of the University of Toronto Libraries and the largest individual library in the university</p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker5, 'click', function() {
      
      if ( (Math.abs(position.coords.latitude - marker5.getPosition().lat())) < 0.001 ){
    alert("You are at Robarts Library, Take a Picture and send it to your freinds");
    marker5.setMap(null);
    }
    else{
    infowindow5.open(map,marker5);
    }
    
  });

//UOFT
    var myLatLng = new google.maps.LatLng(43.6596, -79.3972);
     var marker6 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow6 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Bahen Center</h1>'+
      '<div id="bodyContent">'+
      'The Bahen Centre for Information Technology is a building at the St. George campus of the University of Toronto. The university website bills it as a "state of the art facility for education of information technology professionals in electrical and computer engineering, computer science and IT research</p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker6, 'click', function() {
      
      if ( (Math.abs(position.coords.latitude - marker6.getPosition().lat())) < 0.001 ){
    alert("You are at Bahen Center, Take a Picture and send it to your freinds");
    marker6.setMap(null);
    }
    else{
    infowindow6.open(map,marker6);
    }
    
  });
  
//UOFT
    var myLatLng = new google.maps.LatLng(43.6619, -79.4004);
     var marker7 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow7 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">New College</h1>'+
      '<div id="bodyContent">'+
      'New College is one of the four constituent Colleges of the University of Toronto in Canada. One of the larger colleges with nearly 5000 students, it stands on Huron Street in the historic campus west-end, nestled alongside the Athletic Centre, the Earth Sciences Centre, Sidney Smith Hall and the Ramsey Wright Zoology Laboratory</p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker7, 'click', function() {
      
      if ( (Math.abs(position.coords.latitude - marker7.getPosition().lat())) < 0.001 ){
    alert("You are at New College, Take a Picture and send it to your freinds");
    marker7.setMap(null);
    }
    else{
    infowindow7.open(map,marker7);
    }
    
  });
    
 
//UOFT
    var myLatLng = new google.maps.LatLng(43.6647, -79.3925);
    
     var marker8 = new google.maps.Marker({
        position: myLatLng,
        map: map,
        animation: google.maps.Animation.DROP,
    });
      var infowindow8 = new google.maps.InfoWindow({
      position: myLatLng,
      content: '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Queens Park</h1>'+
      '<div id="bodyContent">'+
      'Queens Park is an urban park in Downtown Toronto, Ontario, Canada. Opened in 1860 by Edward, Prince of Wales, it was named in honour of Queen Victoria. The park is the site of the Ontario Legislative Building, which houses the Legislative Assembly of Ontario, and the phrase Queens Park is regularly used as a metonym for the Government of Ontario.</p>'+
      '</div>'+
      '</div>',

      animation: google.maps.Animation.DROP,
  });
      google.maps.event.addListener(marker8, 'click', function() {
      
      if ( (Math.abs(position.coords.latitude - marker8.getPosition().lat())) < 0.001 ){
    alert("You are at Queens Park, Take a Picture and send it to your freinds");
    marker8.setMap(null);
    }
    else{
    infowindow8.open(map,marker8);
    }
    
  });
    
    
     
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
    var content = 'Error: Your browser doesnt support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);

}
google.maps.event.addDomListener(window, 'load', initialize);

  