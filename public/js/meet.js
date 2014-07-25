/*<!--Map change javascript-->*/
if(typeof(Storage) !== "undefined") {
} else {
}

var xmlhttp;
function loadXMLDoc(url,cfunc)
{
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=cfunc;
xmlhttp.open("GET",url,true);
xmlhttp.send();
}

$(document).ready(function(){
  $(".dotstyle ul li a").click(function(){
    if ($(this).parent().attr("class")!="current") {
      $("#location div h4").text($(this).text());
      if($(this).attr("id")=="addfriend"){
	$("#map-canvas").hide();
	$("#friendAdd").show();
      }else{
	$("#map-canvas").show();
	$("#friendAdd").hide();
	if($(this).attr("id")=="mylocation") {
	  getLocation();
	} else {
	  attendeeLocation($(this).attr("id"));
	}
      }
      $(".current").removeClass("current");
      $(this).parent().addClass("current");
    }
  });
});

$(document).ready(function(){
   $("#search_button").click(function () {
      $(".current").removeClass("current");
		$.get("/center", function(data) {
			var pos = new google.maps.LatLng(data[0], data[1])
		   map = new google.maps.Map(document.getElementById("map-canvas"));
		   map.setZoom(16);
		   map.setCenter(pos);
			var request = {
		 		location: pos,
		 		radius: '50',
		 		query: [$("#search_text").val()]
		 	};
			service = new google.maps.places.PlacesService(map);
	  		service.textSearch(request, function (results, status) {
	  			if (status == google.maps.places.PlacesServiceStatus.OK) {
		 			for (var i = 0; i < results.length; i++) {
		   			var place = results[i];
		   			var marker = new google.maps.Marker({
		   				map: map,
		   				position: place.geometry.location,
							title: place.name
		 				});
						var content = "<div><form method='POST' action='/suggest'><input type='submit' value='suggest'>" +
											"<input type='hidden' value=" + place.name + " name = 'location_name'>" +
											"<input type='hidden' value=" + place.place_id + " name = 'place_id'></form></div>"
    					attachEvent(marker, content);
		 			}
	  			}
			});
		});
	});
});

function attachEvent(marker, message) {
	var infowindow = new google.maps.InfoWindow({
		content: message
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(marker.get('map'), marker);
	});
}
$(document).ready(function(){
   $("#friendAdd").hide();
   getLocation();
});
function getLocation(){
  // Try HTML5 geolocation
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			sendLocation(position.coords.latitude, position.coords.longitude);
			var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map = new google.maps.Map(document.getElementById("map-canvas"));
			map.setZoom(16);
			map.setCenter(pos);
			$.get("/center", function(data) {
				if (!data[2]) {
					var marker = new google.maps.Marker({
						map: map,
						position: pos,
						title:"Your'e here"
				 	});
				} else {
					var request = {
					 	placeId: data[2]
					};
					service = new google.maps.places.PlacesService(map);
					service.getDetails(request, function(place, status) {
						if (status == google.maps.places.PlacesServiceStatus.OK) {
							var directionsService = new google.maps.DirectionsService();
							var directionsDisplay = new google.maps.DirectionsRenderer();
  							directionsDisplay.setMap(map);
							var start = pos;
							var end = place.geometry.location;
							var request = {
								origin:start,
								destination:end,
								travelMode: google.maps.TravelMode.DRIVING
							};
							directionsService.route(request, function(response, status) {
								if (status == google.maps.DirectionsStatus.OK) {
									directionsDisplay.setDirections(response);
								}
							});
					  	}
					});
				}
			});
		});
	}
}

function sendLocation(latitude,longitude) {
  $.post("/location", {latitude:latitude, longitude:longitude}, function(data) {
    if (data) {;
    }
  });
}
 
function attendeeLocation(name) {
  $.get("/location", {name:name}, function(data) {
		var pos = new google.maps.LatLng(data[0], data[1]);
		map = new google.maps.Map(document.getElementById("map-canvas")); 
		map.setZoom(16);      // This will trigger a zoom_changed on the map
		map.setCenter(pos);
		var marker = new google.maps.Marker({
      	map: map,
      	position: pos,
   		title: name + " is here"
    	});
  });
}
