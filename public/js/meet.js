/*<!--Map change javascript-->*/
if(typeof(Storage) !== "undefined") {
    if (localStorage.getItem("uid")) {
	var uid = localStorage.getItem("uid");
	loadXMLDoc("/friends/"+uid,function() {
  	   if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		document.getElementByClassName(".randompad")[0].innerHTML=xmlhttp.responseText;
    	   }
  	});
    }
    if (localStorage.getItem("eid")) {
	var eid = localStorage.getItem("eid");
    }
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
      switch($(this).attr("id")){
      case "mylocation":
	$("#map-canvas").show();
	$("#friendAdd").hide();
        $("#location div h4").text("My Location");
      changeMap(43.659699, -79.397586);
	break;
      case "benlocation":
        $("#location div h4").text("Mashiyat's Location");
	$("#map-canvas").show();
	$("#friendAdd").hide();
      changeMap(43.659691, -79.355580);
        break;
      case "addfriend":
        $("#location div h4").text("Add A Friend");
	$("#map-canvas").hide();
	$("#friendAdd").show();
        break;
      default:
        break;
      }
      $(".current").removeClass("current");
      $(this).parent().addClass("current");
    } 
  });
});
$(document).ready(function(){
    $("#friendAdd").hide();
});
function changeMap(lat,lng) {
  gMap = new google.maps.Map(document.getElementById("map-canvas")); 
  gMap.setZoom(15);      // This will trigger a zoom_changed on the map
  gMap.setCenter(new google.maps.LatLng(lat, lng));
  gMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
}
